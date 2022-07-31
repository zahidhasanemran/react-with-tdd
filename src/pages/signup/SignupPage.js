import axios from "axios"
import React, { useEffect, useState } from "react"

const SignupPage = () => {
  const [disable, setDisable] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const Submit = async (e) => {
    e.preventDefault()
    const body = {
      username,
      email,
      password,
    }
    setLoading(true)
    try {
      // let res = await fetch("/api/1.0/users", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(body),
      // })
      let res = await axios.post("/api/1.0/users", body)
      if (res?.status === 200) {
        setSuccess(true)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.response.status === 400) {
        setErrors(error?.response?.data?.validationErrors)
      }
    }
  }

  useEffect(() => {
    let isMounted = true
    if (
      isMounted &&
      password &&
      confirmPassword &&
      password === confirmPassword
    ) {
      setDisable(false)
    } else {
      setDisable(true)
    }
    return () => {
      isMounted = false
    }
  }, [password, confirmPassword])

  useEffect(() => {
    let timer
    let isMounted = true
    if (success) {
      timer = setTimeout(() => {
        if (isMounted) {
          setSuccess(false)
        }
      }, 2000)
    }

    return () => {
      clearTimeout(timer)
      isMounted = false
    }
  }, [success])

  if (loading) {
    return (
      <div className="loading" role="status" aria-hidden="true">
        <h2>Loading</h2>
      </div>
    )
  }

  return (
    <div className="signup">
      <h2> SIGN UP </h2>
      {success ? (
        <div className="singleInput">
          <p>please check email to activate your account</p>
        </div>
      ) : (
        <form data-testid="form-test-id">
          <div className="singleInput">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              placeholder="username"
            />
            {errors?.username && <p>{errors.username}</p>}
          </div>
          <div className="singleInput">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
              id="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="singleInput">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              // defaultValue={12345678}
              placeholder="password"
              min="4"
              max="6"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="singleInput">
            <label htmlFor="passwordRepeat">Password repeat</label>
            <input
              type="password"
              id="passwordRepeat"
              // defaultValue={12345678}
              min="4"
              max="6"
              placeholder="password repeat"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="singleInput">
            <button
              onClick={(e) => Submit(e)}
              type="submit"
              disabled={disable || loading}
            >
              Sign up
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SignupPage
