"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const characterNames = [
    { firstName: 'Rachel', lastName: 'Green', role: 'client' },
    { firstName: 'Monica', lastName: 'Geller', role: 'client' },
    { firstName: 'Phoebe', lastName: 'Buffay', role: 'client' },
    { firstName: 'Joey', lastName: 'Tribbiani', role: 'client' },
    { firstName: 'Chandler', lastName: 'Bing', role: 'client' },
    { firstName: 'Ross', lastName: 'Geller', role: 'client' },
    { firstName: 'Richard', lastName: 'Winters', role: 'trainer' },
    { firstName: 'Lewis', lastName: 'Nixon', role: 'trainer' },
    { firstName: 'Herbert', lastName: 'Sobel', role: 'trainer' },
    { firstName: 'Carwood', lastName: 'Lipton', role: 'trainer' },
    { firstName: 'William', lastName: 'Guarnere', role: 'trainer' },
    { firstName: 'Donald', lastName: 'Malarkey', role: 'trainer' },
    { firstName: 'Lynn', lastName: 'Compton', role: 'trainer' },
    { firstName: 'David', lastName: 'Webster', role: 'trainer' },
    { firstName: 'Joe', lastName: 'Toye', role: 'trainer' },
    { firstName: 'Denver', lastName: 'Randleman', role: 'trainer' },
    { firstName: 'George', lastName: 'Luz', role: 'trainer' },
    { firstName: 'Frank', lastName: 'Perconte', role: 'trainer' },
    { firstName: 'Burton', lastName: 'Christenson', role: 'trainer' },
    { firstName: 'John', lastName: 'Martin', role: 'trainer' },
    { firstName: 'Darrel', lastName: 'Powers', role: 'trainer' },
    { firstName: 'Robert', lastName: 'Sink', role: 'trainer' },
    { firstName: 'Taylor', lastName: 'Paul', role: 'client' },
    { firstName: 'Demi', lastName: 'Engemann', role: 'client' },
    { firstName: 'Jen', lastName: 'Affleck', role: 'client' },
    { firstName: 'Jessi', lastName: 'Ngatikaura', role: 'client' },
    { firstName: 'Layla', lastName: 'Taylor', role: 'client' },
    { firstName: 'Mayci', lastName: 'Neeley', role: 'client' },
    { firstName: 'Mikayla', lastName: 'Matthews', role: 'client' },
    { firstName: 'Whitney', lastName: 'Leavitt', role: 'client' },
    { firstName: 'Miranda', lastName: 'McWhorter', role: 'client' },
    { firstName: 'Glinda', lastName: 'Goodwitch', role: 'trainer' }, // Fictional Last Name
    { firstName: 'Feyd-Rautha', lastName: 'Harkonnen', role: 'trainer' }, // Fictional Last Name
    { firstName: 'Moana', lastName: 'Waialiki', role: 'client' }, // Fictional Last Name
    { firstName: 'Anxiety', lastName: 'Emotion', role: 'client' }, // Fictional Last Name
    { firstName: 'Deadpool', lastName: 'Merc', role: 'trainer' }, // Fictional Last Name
    { firstName: 'Tashi', lastName: 'Duncan', role: 'trainer' },
    { firstName: 'Zuko', lastName: 'Firelord', role: 'client' }, // Fictional Last Name
    { firstName: 'Jennifer', lastName: 'Kale', role: 'trainer' },
    { firstName: 'Adar', lastName: 'Orc', role: 'trainer' }, // Fictional Last Name
    { firstName: 'Beetlejuice', lastName: 'Ghost', role: 'client' }, // Fictional Last Name
];
const passwordHash = '$2b$10$rKZYvJ5Nh5qX5Z5Z5Z5Z5eO5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z'; // Hash for 'admin123' or similar
const generateTestUsers = (numUsers) => {
    let userSql = 'INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES\n';
    let trainerProfileSql = 'INSERT INTO trainer_profiles (user_id, bio, specialties, certifications, years_experience, is_accepting_clients) VALUES\n';
    const selectedUsers = [];
    const availableNames = [...characterNames]; // Create a mutable copy
    const trainers = [];
    // Ensure unique users by picking from available names
    for (let i = 0; i < numUsers; i++) {
        if (availableNames.length === 0) {
            console.warn('Not enough unique names available to generate desired number of users. Reusing names.');
            availableNames.push(...characterNames); // replenish if needed, allowing duplicates
        }
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        selectedUsers.push(availableNames.splice(randomIndex, 1)[0]);
    }
    selectedUsers.forEach((user, index) => {
        const email = `${user.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${user.lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}${index}@test.com`;
        const phone = `555-${faker_1.faker.string.numeric(4)}`;
        userSql += `('${email}', '${passwordHash}', '${user.firstName}', '${user.lastName}', '${user.role}', '${phone}')${index === numUsers - 1 ? ';' : ',\n'}`;
        if (user.role === 'trainer') {
            trainers.push({ email, firstName: user.firstName, lastName: user.lastName });
        }
    });
    trainerProfileSql += trainers.map((trainer, index) => {
        const bio = faker_1.faker.lorem.paragraph();
        const specialties = JSON.stringify(faker_1.faker.helpers.arrayElements(['Strength Training', 'Yoga', 'HIIT', 'Cardio', 'Nutrition', 'Rehabilitation'], { min: 1, max: 3 }));
        const certifications = JSON.stringify(faker_1.faker.helpers.arrayElements(['NASM-CPT', 'ACE-CPT', 'ISSA-CPT', 'CrossFit Level 1'], { min: 1, max: 2 }));
        const yearsExperience = faker_1.faker.number.int({ min: 2, max: 15 });
        const isAcceptingClients = faker_1.faker.datatype.boolean();
        return `(SELECT id FROM users WHERE email = '${trainer.email}'), '${bio}', '${specialties}', '${certifications}', ${yearsExperience}, ${isAcceptingClients})`;
    }).join(',\n') + ';\n';
    return userSql + '\n\n' + trainerProfileSql;
};
// Ensure "Scott Marquis" exists as an admin user (if not already present).
const ensureAdminScottMarquis = `
INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
VALUES ('samarquis4@gmail.com', '${passwordHash}', 'Scott', 'Marquis', 'admin', '555-0001')
ON CONFLICT (email) DO NOTHING;
`;
const numUsersToGenerate = 15;
const output = `
-- Ensure Scott Marquis (admin) exists
${ensureAdminScottMarquis}

-- Generated Test Users and Trainer Profiles
${generateTestUsers(numUsersToGenerate)}
`;
const outputPath = path.join(__dirname, '../database/generated_test_data.sql');
fs.writeFileSync(outputPath, output);
console.log(`Generated test data written to ${outputPath}`);
//# sourceMappingURL=generateTestUsers.js.map