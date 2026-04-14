# 📧 Mailcheck-JS

Simple email validator for JavaScript.

---

## 🚀 Usage

```js
var check = new Mailcheck();
check.check(email, options);

// or directly
Mailcheck.check(email, options);
```

The only required parameter is the email.

---

## 🔍 Validation options

1️⃣ **Basic structure** (default)  
Validates the email structure with allowed characters:  
`[A-Z a-z 0-9 . _ % + - ç Ç] + @ + [a-z A-Z 0-9 . -] + [a-z A-Z]{2,}`  
Returns `true` if valid, `false` otherwise.

2️⃣ **Option 1**  
In addition to the basic structure, the domain must end with `.com`, `.com.br`, or `.br`.  
Emails without these endings will be rejected.

3️⃣ **Option 2**  
Allows only personal emails from common providers:  
`gmail.com | outlook.com | outlook.com.br | hotmail.com | hotmail.com.br | live.com | live.com.br | yahoo.com | yahoo.com.br | terra.com | terra.com.br | icloud.com | uol.com.br | myyahoo.com | myyahoo.com.br`

4️⃣ **Custom option**  
Accepts an array or string (separated by `|` or comma) with allowed domains, for example:

```js
check.check(email, ['@gmail.com', '@hotmail.com']);
check.check(email, '@gmail.com,@hotmail.com');
check.check(email, '@gmail.com|@hotmail.com');
```

---

## ⚠️ Important notes

- This version of **Mailcheck-JS** was one of the first codes derived from **Mailcheck-PHP** (v0.0.1), converted to JavaScript.  
- Currently, this library is outdated compared to the PHP version.  
- I plan to remake this JS library after finishing the PHP version refactor, but there's no timeline yet.

---

## 🔗 Relation with Mailcheck-PHP

The **Mailcheck-JS** library was inspired by **Mailcheck-PHP**, created to provide combined front-end and back-end validation.

Check out the PHP project here:  
[Mailcheck-PHP](https://github.com/pedrohrigolin/Mailcheck-PHP)

---