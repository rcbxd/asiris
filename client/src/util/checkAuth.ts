export default async function checkAuth(token: string) {
  console.log(token);
  if (token) {
    let res = await fetch(
      `http://localhost:5000/api/account/verify?token=${token}`
    );
    let json = await res.json();
    if (json.success) {
      let res2 = await fetch(
        `http://localhost:5000/api/account/getuserbytoken?token=${token}`
      );
      let json2 = await res2.json();
      if (json2.success)
        return {
          firstName: json2.firstName,
          lastName: json2.lastName,
          email: json2.email,
          uid: json2.id,
          loggedIn: true
        };
      else {
        return {
          firstName: "",
          lastName: "",
          email: "",
          uid: 0,
          loggedIn: false
        };
      }
    } else {
      return {
        firstName: "",
        lastName: "",
        email: "",
        uid: 0,
        loggedIn: false
      };
    }
  } else {
    return {
      firstName: "",
      lastName: "",
      email: "",
      uid: 0,
      loggedIn: false
    };
  }
}
