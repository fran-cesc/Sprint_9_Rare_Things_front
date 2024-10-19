
export const userLoggedGuard = () => {
  if (localStorage.getItem('token')){
    return true;
  } else return false;
}
