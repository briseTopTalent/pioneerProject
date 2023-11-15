# Goals
- [x] Locality twitter tokens must all be removed if the requesting user is NOT an admin
- [x] Middleware should include non-admin recognition
- [x] User details should not include most of the fields we're passing back if the user is NOT an admin

# Nice to have
- Ideally, the localities endpoints should never return the `twitter_*` fields even for admins. Instead, it should allow overwrite only

# Status
As of Sat Oct 28 13:10:25 MDT 2023, locality and user info fields are drastically reduced when the user requesting the information is not an admin.
A user is recognized as admin and this data is stored in their user object which is populated by the user middleware. It is now possible to use 
```js
if (req.user.is_admin)
```

... to verify if the user in question is an admin. 
What makes a user an admin?
- If their role is `super` or `admin`. Any other value means they are a regular user.

# Notable changes
- `/users` URL will no longer leak sensitive information regarding the users of the system to *non-admin users*
- `/localities` endpoints will no longer leak ALL FIELDS to non-admin users
    - All `twitter_*` fields are removed
    - Only *admin* users can see these fields
