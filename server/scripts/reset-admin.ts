import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const args = process.argv.slice(2);
const newEmail = args[0] || process.env.ADMIN_EMAIL || 'admin@villagedeli.in';
const newPassword = args[1] || process.env.ADMIN_PASSWORD;

if (!newPassword) {
  console.error('\nUsage: npm run reset-admin <email> <new_password>');
  console.error('Example: npm run reset-admin admin@villagedeli.in MyNewSecretPassword123!\n');
  process.exit(1);
}

if (!fs.existsSync(DATA_FILE)) {
  console.error('store.json not found at:', DATA_FILE);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw);
  const passwordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');

  let adminUser = data.users.find((u: any) => u.role === 'super_admin');
  if (!adminUser) {
    adminUser = {
      id: 'usr_admin_01',
      email: newEmail.trim().toLowerCase(),
      full_name: 'VillageDELI Administrator',
      phone: '+91 98765 43210',
      role: 'super_admin',
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };
    data.users.push(adminUser);
  } else {
    adminUser.email = newEmail.trim().toLowerCase();
    adminUser.password_hash = passwordHash;
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log('\n✅ Admin credentials successfully updated!');
  console.log(`Email:    ${adminUser.email}`);
  console.log(`Password: ${newPassword.trim()}\n`);
} catch (err) {
  console.error('Failed to update admin credentials:', err);
  process.exit(1);
}
