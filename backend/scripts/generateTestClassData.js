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
const uuid_1 = require("uuid");
// =================================================================
// 1. DATA TO SIMULATE (in a real scenario, this would be queried)
// =================================================================
// Inferred from generateTestUsers.ts output
const clients = [
    { email: 'rachel.green0@test.com', firstName: 'Rachel', lastName: 'Green' },
    { email: 'monica.geller1@test.com', firstName: 'Monica', lastName: 'Geller' },
    { email: 'phoebe.buffay2@test.com', firstName: 'Phoebe', lastName: 'Buffay' },
    { email: 'joey.tribbiani3@test.com', firstName: 'Joey', lastName: 'Tribbiani' },
    { email: 'chandler.bing4@test.com', firstName: 'Chandler', lastName: 'Bing' },
    { email: 'ross.geller5@test.com', firstName: 'Ross', lastName: 'Geller' },
    { email: 'taylor.paul6@test.com', firstName: 'Taylor', lastName: 'Paul' },
    { email: 'demi.engemann7@test.com', firstName: 'Demi', lastName: 'Engemann' },
    { email: 'jen.affleck8@test.com', firstName: 'Jen', lastName: 'Affleck' },
    { email: 'jessi.ngatikaura9@test.com', firstName: 'Jessi', lastName: 'Ngatikaura' },
];
// Inferred from generateTestUsers.ts output
const trainers = [
    { email: 'richard.winters10@test.com', firstName: 'Richard', lastName: 'Winters' },
    { email: 'lewis.nixon11@test.com', firstName: 'Lewis', lastName: 'Nixon' },
    { email: 'herbert.sobel12@test.com', firstName: 'Herbert', lastName: 'Sobel' },
];
// Inferred from seed.sql
const classes = [
    { name: 'Barre w/ Michelle', category: 'Barre' },
    { name: 'Tsunami Strength w/ Lisa', category: 'Circuits' }, // This will be our "weight lifting" class
    { name: 'Power Bounce w/ Kalee', category: 'Power Bounce' },
    { name: 'Vinyasa Yoga w/ Edna', category: 'Yoga' },
];
const weightLiftingExercises = [
    { name: 'Barbell Squat', workout_type: 'Strength' },
    { name: 'Deadlift', workout_type: 'Strength' },
    { name: 'Bench Press', workout_type: 'Strength' },
    { name: 'Pull-ups', workout_type: 'Strength' },
    { name: 'Shoulder Press', workout_type: 'Strength' },
    { name: 'Dumbbell Rows', workout_type: 'Strength' },
    { name: 'Bicep Curls', workout_type: 'Strength' },
    { name: 'Leg Press', workout_type: 'Strength' },
];
// =================================================================
// 2. SQL GENERATION SCRIPT
// =================================================================
const generateTestClassData = () => {
    let sql = '-- Generated Test Class & Workout Session Data\n\n';
    clients.forEach(client => {
        sql += `-- Data for client: ${client.firstName} ${client.lastName}\n`;
        for (let i = 0; i < 15; i++) {
            const randomClass = faker_1.faker.helpers.arrayElement(classes);
            const randomTrainer = faker_1.faker.helpers.arrayElement(trainers);
            const sessionDate = faker_1.faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().split('T')[0];
            const sessionId = (0, uuid_1.v4)();
            const isWeightLifting = randomClass.category === 'Circuits';
            // -- Create a workout_session --
            sql += `

-- Session for ${randomClass.name}
DO $$
DECLARE
    client_id_var UUID;
    trainer_id_var UUID;
    class_id_var UUID;
    workout_type_id_var UUID;
    session_id_var UUID := '${sessionId}';
    session_exercise_id_var UUID;
BEGIN
    -- Get IDs from database
    SELECT id INTO client_id_var FROM users WHERE email = '${client.email}';
    SELECT id INTO trainer_id_var FROM users WHERE email = '${randomTrainer.email}';
    SELECT id INTO class_id_var FROM classes WHERE name = '${randomClass.name}';
    SELECT id INTO workout_type_id_var FROM workout_types WHERE name = 'Strength'; // Assuming all are strength based for now

    -- Insert workout session
    INSERT INTO workout_sessions (id, trainer_id, class_id, workout_type_id, session_date, duration_minutes, is_published)
    VALUES (session_id_var, trainer_id_var, class_id_var, workout_type_id_var, '${sessionDate}', 45, true);

    -- Insert participant
    INSERT INTO session_participants (session_id, client_id, attended)
    VALUES (session_id_var, client_id_var, true);
`;
            // -- If it's a weight lifting class, add exercises and logs --
            if (isWeightLifting) {
                const selectedExercises = faker_1.faker.helpers.arrayElements(weightLiftingExercises, { min: 5, max: 5 });
                selectedExercises.forEach((exercise, index) => {
                    const sessionExerciseId = (0, uuid_1.v4)();
                    sql += `
    -- Add exercise to session: ${exercise.name}
    DO $$
    DECLARE
        exercise_id_var UUID;
    BEGIN
        SELECT id INTO exercise_id_var FROM exercises WHERE name = '${exercise.name}';
        INSERT INTO session_exercises (id, session_id, exercise_id, order_in_session, planned_sets, planned_reps, planned_weight_lbs)
        VALUES ('${sessionExerciseId}', session_id_var, exercise_id_var, ${index + 1}, 3, 10, ${faker_1.faker.number.int({ min: 50, max: 250 })});

        -- Log performance for this exercise
        INSERT INTO exercise_logs (session_exercise_id, client_id, set_number, reps_completed, weight_used_lbs, logged_by)
        VALUES
            ('${sessionExerciseId}', client_id_var, 1, ${faker_1.faker.number.int({ min: 8, max: 12 })}, ${faker_1.faker.number.int({ min: 50, max: 250 })}, client_id_var),
            ('${sessionExerciseId}', client_id_var, 2, ${faker_1.faker.number.int({ min: 8, max: 12 })}, ${faker_1.faker.number.int({ min: 50, max: 250 })}, client_id_var),
            ('${sessionExerciseId}', client_id_var, 3, ${faker_1.faker.number.int({ min: 8, max: 12 })}, ${faker_1.faker.number.int({ min: 50, max: 250 })}, client_id_var);
    END $$;
`;
                });
            }
            sql += `
END $$;
-- End of session for ${randomClass.name}

`;
        }
    });
    return sql;
};
const output = generateTestClassData();
const outputPath = path.join(__dirname, '../database/generated_test_class_data.sql');
fs.writeFileSync(outputPath, output);
console.log(`Generated test class and workout data written to ${outputPath}`);
// To use this script:
// 1. Ensure you have run generateTestUsers.ts and the resulting SQL.
// 2. Ensure your database is seeded with initial classes and exercises from seed.sql.
// 3. Run: ts-node backend/scripts/generateTestClassData.ts
// 4. The output will be in backend/database/generated_test_class_data.sql.
// 5. You can then run this SQL file against your database.
//# sourceMappingURL=generateTestClassData.js.map