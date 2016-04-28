cat /tmp/sender_hash | base64 -d > /tmp/toSign.sig
openssl x509 -inform der -in /tmp/sender_cer.der -out /tmp/sender_cer.pem
openssl x509 -pubkey -noout -in /tmp/sender_cer.pem  > /tmp/sender_pubkey.pem
openssl dgst -sha512 -verify /tmp/sender_pubkey.pem -signature /tmp/toSign.sig /tmp/sender_email
