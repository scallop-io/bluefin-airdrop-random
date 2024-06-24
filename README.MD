## Bluefin Airdrop Randomization Process

### Event Rule

- A snapshot will be taken June 24st.

### Randomization Logic

After taking a snapshot at a random time and compiling a list of eligible users, we will select 1000 random users to receive the Bluefin airdrop. Here is the process for selecting the 1000 random users:

1. Retrieve the complete list of eligible users.
2. Select a future drand round to use as the seed for hashing the list.
3. When the chosen drand round occurs, use that round's Drand result as the source of randomness.
4. Combine each user's Sui address with the randomness in the format {address}{randomness}, and then hash this combination using the Blake2b algorithm, producing a hash result in hexadecimal form.
5. Convert the hexadecimal hash result into a number.
6. Sort these numbers from largest to smallest and pick the top 1000 users from the sorted results as winners of the Pyth airdrop.
