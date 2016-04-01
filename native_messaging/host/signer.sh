openssl dgst -binary -sha512 /tmp/toSign | /usr/bin/pkcs15-crypt --sign --key 01 --sha-512 --pkcs1 -p 0071 --raw | base64
