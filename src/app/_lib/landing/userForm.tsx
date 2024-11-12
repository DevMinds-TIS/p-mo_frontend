import React, { useMemo, useState } from 'react';

export default function userForms() {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswdTouched, setIsPasswdTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  const [name, setName] = useState("");
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [lastname, setLastname] = useState("");
  const [isLastNameTouched, setIsLastNameTouched] = useState(false);

  const [code, setCode] = useState("");
  const [isCodeTouched, setIsCodeTouched] = useState(false);
  const [siscode, setSisCode] = useState("");
  const [isSiscodeTouched, setIsSiscodeTouched] = useState(false);


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

  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);
  const isInvalidPasswd = useMemo(() => {
    const error = validatePasswd(passwd)
    setPasswordError(error)
    return error !== "";
  }, [passwd]);

  const isInvalidName = useMemo(() => {
    const error = validateName(name);
    return error !== "";
  }, [name]);
  const isInvalidLastname = useMemo(() => {
    const error = validateLastname(lastname);
    return error !== "";
  }, [lastname]);

  const isInvalidCode = useMemo(() => {
    const error = validateCode(code);
    return error !== "";
  }, [code]);

  const isInvalidSiscode = useMemo(() => {
    const error = validateSiscode(siscode);
    return error !== "";
  }, [siscode]);

  const isLoginValid = !isInvalidEmail && !isInvalidPasswd;
  const isSingupValid = !isInvalidEmail && !isInvalidPasswd && !isInvalidName && !isInvalidLastname;

  const [isVisible, setIsVisible] = useState(false);
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
    isNameTouched,
    setIsNameTouched,
    lastname,
    setLastname,
    isLastNameTouched,
    setIsLastNameTouched,
    code,
    setCode,
    isCodeTouched,
    setIsCodeTouched,
    siscode,
    setSisCode,
    isSiscodeTouched,
    setIsSiscodeTouched,
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
