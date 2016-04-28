openssl dgst -binary -sha512 /tmp/toSign | /usr/bin/pkcs15-crypt --sign --key 02 --sha-512 --pkcs1 -p 00000 --raw | base64
