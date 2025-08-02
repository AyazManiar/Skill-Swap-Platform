
# ✅ Server: `http://localhost:3000/`

---

## ❗ On Errors

```js
res.status(500).json({ message: 'Message', error: error.message });
```

---

## 📦 Routes

```js
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); 
```

---

## 📂 userRoutes

```js
// Route: /api/users
router.get('/', authMiddleware, restrictToUser, getAllUsers);
```

> 🔐 Requires user to be logged in and have "user" role or higher.

---

## 🔐 authRoutes (`/api/auth`), Credentials: true (must)
```
// app/auth
router.post('/signUp', signup)
router.post('/logIn', login)
router.post('/logOut', logout)
router.get('/checkLoggedIn', authMiddleware, checkLoggedin)
```
### 🔹 **signUp**
```js
POST /api/auth/signUp
```
* **Input (req.body):**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourPassword123"
  }
  ```
* **Output (201):**

  ```json
  {
    "message": "User created",
    "userId": "USER_OBJECT_ID",
    "email": "user@gmail.com"
  }
  ```
---

### 🔹 **logIn**
```js
POST /api/auth/logIn
```
* **Input (req.body):**

  ```json
  {
    "email": "john@example.com",
    "password": "yourPassword123"
  }
  ```
* **Output (200):**

  ```json
  {
    "userId": "USER_OBJECT_ID"
  }
  ```
* 🔐 Sets an `HttpOnly` cookie: `jwt`
---

### 🔹 **logOut**
```js
POST /api/auth/logOut
```
* **Input:** *(no body required, cookie must be present)*
* **Output (200):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
* ✅ Clears the `jwt` cookie
---

### 🔹 **checkLoggedIn**
```js
GET /api/auth/checkLoggedIn
```
* **Input:** *(cookie: `jwt`)*
* **Output (200 or 401):**
  ```json
  // If logged in:
  {
    "isLoggedIn": true,
    "userId": "USER_OBJECT_ID",
    "role": "user"
  }
  // If not logged in:
  {
    "isLoggedIn": false
  }
  ```
---

## ✅ **User Routes** (`/api/users`)
### 🔹 **getAllUsers**
```js
GET /api/users/
```
* 🔐 Protected: Requires `authMiddleware` and `restrictToUser` (or admin)
* **Input:** *(cookie: `jwt`)*
* **Output (200):**
  ```json
    [
        {
            "_id": "USER_OBJECT_ID",
            "name": "John Doe",
            "email": "john@example.com",
            ...
        },
        ...
    ]
  ```
* **Output (404):**
  ```json
    {
        "message": "No users found"
    }

  ```
---
* **Output (500):**
  ```json
    {
        "message": "Server Error"
    }

  ```
---
