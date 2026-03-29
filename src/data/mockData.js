export const mockUsers = [
  { id: 1, username: "player1",  password: "pass123",  role: "player", team: "0xDEADBEEF" },
  { id: 2, username: "player2",  password: "pass123",  role: "player", team: "NullPointers" },
  { id: 3, username: "player3",  password: "pass123",  role: "player", team: "SegFault Squad" },
  { id: 4, username: "gmaster",  password: "admin123", role: "gm",     team: null },
]

export const mockStandings = [
  { id: 1, name: "0xDEADBEEF",     score: 4750, account_url: "#" },
  { id: 2, name: "NullPointers",   score: 3900, account_url: "#" },
  { id: 3, name: "SegFault Squad", score: 3100, account_url: "#" },
  { id: 4, name: "Shell Shocked",  score: 2400, account_url: "#" },
  { id: 5, name: "Team Kernel",    score: 1850, account_url: "#" },
  { id: 6, name: "ByteMe",         score: 1200, account_url: "#" },
]

export const mockChallenges = [
  { id: 1,  name: "Cookie Monster",      category: "Web",      value: 100, description: "Someone left their cookies out. Can you steal them?\n\nThe flag is hidden in a cookie. Inspect your browser's dev tools.", solved_by_me: true,  tags: [] },
  { id: 2,  name: "SQL Injection 101",   category: "Web",      value: 200, description: "This login form looks suspicious. Try breaking it with some classic SQL injection techniques.", solved_by_me: false, tags: [] },
  { id: 3,  name: "XSS Me If You Can",  category: "Web",      value: 300, description: "The comment section doesn't sanitize input. Inject a script to steal the admin cookie.", solved_by_me: false, tags: [] },
  { id: 4,  name: "JWT Jailbreak",       category: "Web",      value: 500, description: "The server trusts JWT tokens a little too much. Can you forge one?", solved_by_me: false, tags: [] },
  { id: 5,  name: "Caesar's Secret",    category: "Crypto",   value: 100, description: "Et tu, Brute? Decode this ancient cipher:\n\nSYNP{pnrfne_vf_rnfl}", solved_by_me: true,  tags: [] },
  { id: 6,  name: "Base64 Buster",      category: "Crypto",   value: 100, description: "Decode this: U1lOUHtiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259", solved_by_me: false, tags: [] },
  { id: 7,  name: "RSA Rookie",         category: "Crypto",   value: 400, description: "We intercepted this RSA encrypted message. Small primes were used. Can you factor n?", solved_by_me: false, tags: [] },
  { id: 8,  name: "Hash Cracker",       category: "Crypto",   value: 250, description: "We found this MD5 hash: 5f4dcc3b5aa765d61d8327deb882cf99. What's the original?", solved_by_me: false, tags: [] },
  { id: 9,  name: "Hidden in Plain Sight", category: "Forensics", value: 150, description: "This image looks normal but something is hidden inside it. Try running steghide on it.", solved_by_me: false, tags: [] },
  { id: 10, name: "Memory Dump",        category: "Forensics", value: 350, description: "We captured a memory dump from a compromised machine. Find the flag hiding in the process list.", solved_by_me: false, tags: [] },
  { id: 11, name: "PCAP Detective",     category: "Forensics", value: 300, description: "Analyze this network capture and find the credentials being sent in plaintext.", solved_by_me: false, tags: [] },
  { id: 12, name: "Buffer Overflow 101", category: "Binary",  value: 300, description: "Classic stack buffer overflow. Overwrite the return address to get a shell.", solved_by_me: false, tags: [] },
  { id: 13, name: "Format String Fun",  category: "Binary",   value: 400, description: "The printf call is missing its format string. Leak the flag from memory.", solved_by_me: false, tags: [] },
  { id: 14, name: "Find The Dev",       category: "OSINT",    value: 100, description: "The developer of this CTF left their GitHub public. Find their secret gist.", solved_by_me: false, tags: [] },
  { id: 15, name: "Geolocation",        category: "OSINT",    value: 200, description: "Where was this photo taken? Submit the coordinates as the flag.", solved_by_me: false, tags: [] },
]

export const validFlags = {
  1:  "FLAG{c00k13s_ar3_d3licious}",
  2:  "FLAG{sql_1nj3ct10n_ftw}",
  3:  "FLAG{xss_is_fun_and_dangerous}",
  4:  "FLAG{jwt_alg_none_bypass}",
  5:  "FLAG{caesar_is_easy}",
  6:  "FLAG{base64_is_not_encryption}",
  7:  "FLAG{rsa_small_primes_bad}",
  8:  "FLAG{password}",
  9:  "FLAG{steganography_master}",
  10: "FLAG{volatility_rocks}",
  11: "FLAG{wireshark_detective}",
  12: "FLAG{buffer_overflow_classic}",
  13: "FLAG{format_string_leaker}",
  14: "FLAG{github_osint_ez}",
  15: "FLAG{40.7128_N_74.0060_W}",
}