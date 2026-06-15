SoberShield quick fix build

1. Delete node_modules and package-lock.json
2. Run: npm install --legacy-peer-deps
3. Run: npx expo start -c
4. Press w for web or scan QR in Expo Go

If PowerShell delete commands are needed:
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
