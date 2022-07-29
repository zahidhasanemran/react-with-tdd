import axios from "axios"
import React, { useEffect, useState } from "react"

const SignupPage = () => {
  const [disable, setDisable] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const Submit = (e) => {
    e.preventDefault()
    const body = {
      username,
      email,
      password,
    }
    setLoading(true)
    fetch("http://localhost:8080/api/1.0/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [password, confirmPassword])

  if (loading) {
    return (
      <div className="loading" role="status">
        <h2>Loading</h2>
      </div>
    )
  }

  return (
    <div className="signup">
      <h2> SIGN UP </h2>
      <form>
        <div className="singleInput">
          <label htmlFor="username">Username</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            placeholder="username"
          />
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
    </div>
  )
}

export default SignupPage
