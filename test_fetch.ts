
async function run() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/exercemus/exercises/minified/minified-exercises.json');
        const data = await res.json();
        
        // Data is an object where keys are IDs and values are objects with info
        const exercises = Object.values(data);
        console.log(`Analyzing ${exercises.length} exercises...`);
        
        const filtered = (exercises as any[]).filter(ex => {
            const equipment = ex.equipment?.toLowerCase() || '';
            const name = ex.name?.toLowerCase() || '';
            return equipment.includes('suspension') || equipment.includes('rings') || name.includes('trx');
        });
        
        console.log(`Found ${filtered.length} potential matches.`);
        filtered.slice(0, 10).forEach(ex => console.log(`- ${ex.name} (Equip: ${ex.equipment})`));
    } catch (err) {
        console.error(err);
    }
}
run();
