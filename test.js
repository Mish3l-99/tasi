const user = auth.currentUser;

updateEmail(auth.currentUser, "user@example.com")
  .then(() => {
    // Email updated!
    // ...
  })
  .catch((error) => {
    // An error occurred
    // ...
  });

updatePassword(user, newPassword)
  .then(() => {
    // Update successful.
  })
  .catch((error) => {
    // An error ocurred
    // ...
  });

import { getAuth, reauthenticateWithCredential } from "firebase/auth";

const auth = getAuth();

// TODO(you): prompt the user to re-provide their sign-in credentials
const credential = promptForCredentials();

reauthenticateWithCredential(user, credential)
  .then(() => {
    // User re-authenticated.
  })
  .catch((error) => {
    // An error ocurred
    // ...
  });
