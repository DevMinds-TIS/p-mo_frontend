import React from 'react';

export default function userForms() {
  const [email, setEmail] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [isPasswdTouched, setIsPasswdTouched] = React.useState(false);
  const [isEmailTouched, setIsEmailTouched] = React.useState(false);

  const [name, setName] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [rol, setRol] = React.useState("");

  const [code, setCode] = React.useState("");
  const [siscode, setSisCode] = React.useState("");


  const validateEmail = (email: string) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const validatePasswd = (passwd: string) => {
    if (passwd.length < 8) {
      return "La contraseña debe contener al menos 8 caracteres";
    }
    if (!passwd.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~áéíóúÁÉÍÓÚñÑ]/)) {
      return "La contraseña debe contener al menos un carácter especial o acento";
    }
    return "";
  };

  const validateName = (name: string) => {
    if (name.length < 3) {
      return "El nombre debe contener al menos 3 caracteres";
    }
    return "";
  };
  const validateLastname = (lastname: string) => {
    if (lastname.length < 5) {
      return "El apellido debe contener al menos 5 caracteres";
    }
    return "";
  };

  const validateCode = (code: string) => {
    if (code.length < 5) {
      return "El código secreto debe contener al menos 5 caracteres";
    }
    return "";
  };

  const validateSiscode = (siscode: string) => {
    if (siscode.length < 9) {
      return "El código SIS debe contener al menos 9 caracteres";
    }
    return "";
  };

  const isInvalidEmail = React.useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);
  const isInvalidPasswd = React.useMemo(() => {
    const error = validatePasswd(passwd)
    setPasswordError(error)
    return error !== "";
  }, [passwd]);

  const isInvalidName = React.useMemo(() => {
    const error = validateName(name);
    return error !== "";
  }, [name]);
  const isInvalidLastname = React.useMemo(() => {
    const error = validateLastname(lastname);
    return error !== "";
  }, [lastname]);

  const isInvalidCode = React.useMemo(() => {
    const error = validateCode(code);
    return error !== "";
  }, [code]);

  const isInvalidSiscode = React.useMemo(() => {
    const error = validateSiscode(siscode);
    return error !== "";
  }, [siscode]);

  const isLoginValid = !isInvalidEmail && !isInvalidPasswd;
  const isSingupValid = !isInvalidEmail && !isInvalidPasswd && !isInvalidName && !isInvalidLastname;

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return {
    email,
    setEmail,
    passwd,
    setPasswd,
    passwordError,
    isPasswdTouched,
    setIsPasswdTouched,
    isEmailTouched,
    setIsEmailTouched,
    name,
    setName,
    lastname,
    setLastname,
    code,
    setCode,
    siscode,
    setSisCode,
    isInvalidEmail,
    isInvalidPasswd,
    isInvalidName,
    isInvalidLastname,
    isInvalidCode,
    isInvalidSiscode,
    isLoginValid,
    isSingupValid,
    isVisible,
    setIsVisible,
    toggleVisibility,
  };
}
