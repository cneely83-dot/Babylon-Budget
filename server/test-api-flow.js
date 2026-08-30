const signupRes = await fetch('http://localhost:4000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Arkad of Babylon',
    email: 'arkad@babylon.com',
    password: 'password123',
  }),
});

const signupData = await signupRes.json();
console.log('Signup result from API:', signupData);

if (signupData.token) {
  const saveRes = await fetch('http://localhost:4000/api/budget', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${signupData.token}`,
    },
    body: JSON.stringify({
      categories: ['Housing', 'Food & dining', 'Transportation', 'Gold Vault 10%'],
      incomeSources: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          label: 'Master Builder',
          estimatedTakeHome: 4500,
          frequency: 'biweekly',
          lastPayDate: '2026-08-25',
          incomeType: 'salary',
        },
      ],
      bills: [
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'High Citadel Tower',
          anticipatedAmount: 1500,
          dueDay: 1,
          paymentMethod: 'autopay',
          paymentUrl: 'https://citadel.com',
        },
      ],
    }),
  });

  const saveData = await saveRes.json();
  console.log('Save budget result from API:', saveData);

  const getRes = await fetch('http://localhost:4000/api/budget', {
    headers: { Authorization: `Bearer ${signupData.token}` },
  });
  const getData = await getRes.json();
  console.log('Retrieved budget from Neon:', getData);
}
