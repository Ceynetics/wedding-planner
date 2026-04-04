package pl.piomin.services.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class OAuth2TokenVerifier {

    private final String googleClientId;
    private final String appleClientId;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OAuth2TokenVerifier(@Value("${google.client-id}") String googleClientId,
                               @Value("${apple.client-id}") String appleClientId) {
        this.googleClientId = googleClientId;
        this.appleClientId = appleClientId;
    }

    public OAuth2UserInfo verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            return new OAuth2UserInfo(
                    payload.getSubject(),
                    payload.getEmail(),
                    (String) payload.get("name"),
                    (String) payload.get("picture")
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to verify Google token: " + e.getMessage(), e);
        }
    }

    @SuppressWarnings("unchecked")
    public OAuth2UserInfo verifyAppleToken(String identityToken) {
        try {
            // Fetch Apple's public keys
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://appleid.apple.com/auth/keys"))
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> jwks = objectMapper.readValue(response.body(), Map.class);
            List<Map<String, String>> keys = (List<Map<String, String>>) jwks.get("keys");

            // Decode the token header to find the matching key
            String[] parts = identityToken.split("\\.");
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
            Map<String, String> header = objectMapper.readValue(headerJson, Map.class);
            String kid = header.get("kid");

            Map<String, String> matchingKey = keys.stream()
                    .filter(k -> k.get("kid").equals(kid))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("No matching Apple key found"));

            // Build the public key
            byte[] nBytes = Base64.getUrlDecoder().decode(matchingKey.get("n"));
            byte[] eBytes = Base64.getUrlDecoder().decode(matchingKey.get("e"));
            RSAPublicKeySpec spec = new RSAPublicKeySpec(
                    new BigInteger(1, nBytes), new BigInteger(1, eBytes));
            PublicKey publicKey = KeyFactory.getInstance("RSA").generatePublic(spec);

            // Verify and parse the token
            Claims claims = Jwts.parser()
                    .verifyWith((javax.crypto.SecretKey) null)
                    .build()
                    .parseSignedClaims(identityToken)
                    .getPayload();

            // For Apple, we use the standard JWT library with RSA verification
            // Re-parse with the RSA public key
            claims = Jwts.parser()
                    .requireIssuer("https://appleid.apple.com")
                    .requireAudience(appleClientId)
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(identityToken)
                    .getPayload();

            return new OAuth2UserInfo(
                    claims.getSubject(),
                    claims.get("email", String.class),
                    null, // Apple doesn't always return name in the token
                    null
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to verify Apple token: " + e.getMessage(), e);
        }
    }

    @Data
    @AllArgsConstructor
    public static class OAuth2UserInfo {
        private String providerId;
        private String email;
        private String name;
        private String pictureUrl;
    }
}
