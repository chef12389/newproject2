﻿import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { enterGuestMode, isAuthenticated, loginUser, registerUser } from '@/lib/auth'
import { beginEntryPrologue } from '@/lib/entryPrologue'
import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { dropdownVariants, hoverLift, modalVariants, overlayVariants, tapPress } from '@/lib/motion'

type TabId = 'login' | 'register' | 'guest'

type MousePoint = {
  x: number
  y: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function calcFacePosition(baseX: number, baseY: number, width: number, height: number, mouse: MousePoint) {
  const cx = baseX + width / 2
  const cy = baseY + height / 3
  const dx = mouse.x - cx
  const dy = mouse.y - cy

  return {
    faceX: clamp(dx / 20, -15, 15),
    faceY: clamp(dy / 30, -10, 10),
    bodySkew: clamp(-dx / 120, -6, 6),
  }
}

function calcPupilOffset(cx: number, cy: number, mouse: MousePoint, maxDist: number) {
  const dx = mouse.x - cx
  const dy = mouse.y - cy
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist)
  const angle = Math.atan2(dy, dx)

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  }
}

function CharacterScene({
  nameFocused,
  emailFocused,
  passwordFocused,
  showPassword,
  passwordLength,
  errorPose,
  mouse,
}: {
  nameFocused: boolean
  emailFocused: boolean
  passwordFocused: boolean
  showPassword: boolean
  passwordLength: number
  errorPose: boolean
  mouse: MousePoint
}) {
  const [purpleBlinking, setPurpleBlinking] = useState(false)
  const [blackBlinking, setBlackBlinking] = useState(false)
  const [purplePeeking, setPurplePeeking] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timeoutId: number | undefined

    const loop = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        setPurpleBlinking(true)
        window.setTimeout(() => {
          if (cancelled) return
          setPurpleBlinking(false)
          loop()
        }, 150)
      }, Math.random() * 4000 + 3000)
    }

    loop()
    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let timeoutId: number | undefined

    const loop = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        setBlackBlinking(true)
        window.setTimeout(() => {
          if (cancelled) return
          setBlackBlinking(false)
          loop()
        }, 150)
      }, Math.random() * 4000 + 3000)
    }

    loop()
    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!(showPassword && passwordLength > 0)) {
      setPurplePeeking(false)
      return
    }

    let cancelled = false
    let timeoutId: number | undefined

    const loop = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        setPurplePeeking(true)
        window.setTimeout(() => {
          if (cancelled) return
          setPurplePeeking(false)
          loop()
        }, 800)
      }, Math.random() * 3000 + 2000)
    }

    loop()
    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [passwordLength, showPassword])

  const typingEmail = emailFocused || nameFocused
  const showingPassword = passwordLength > 0 && showPassword
  const lookingAway = passwordFocused && !showPassword


  const purplePos = calcFacePosition(60, 0, 170, 370, mouse)
  const blackPos = calcFacePosition(220, 80, 115, 290, mouse)
  const orangePos = calcFacePosition(0, 180, 230, 190, mouse)
  const yellowPos = calcFacePosition(290, 155, 135, 215, mouse)

  const purplePupil = calcPupilOffset(114, 49, mouse, 5)
  const blackPupil = calcPupilOffset(254, 120, mouse, 4)
  const orangePupil = calcPupilOffset(88, 275, mouse, 5)
  const yellowPupil = calcPupilOffset(352, 208, mouse, 5)

  const purpleTransform = errorPose
    ? 'skewX(-8deg)'
    : showingPassword
      ? 'skewX(0deg)'
      : lookingAway
        ? 'skewX(-16deg) translateX(-25px)'
        : typingEmail
          ? `skewX(${purplePos.bodySkew * 1.5}deg) translateY(-10px) scale(1.05)`
          : `skewX(${purplePos.bodySkew}deg)`

  const blackTransform = errorPose
    ? 'skewX(10deg)'
    : showingPassword
      ? 'skewX(0deg)'
      : lookingAway
        ? 'skewX(14deg) translateX(-15px)'
        : typingEmail
          ? `skewX(${blackPos.bodySkew * 1.5}deg) translateY(-8px) scale(1.05)`
          : `skewX(${blackPos.bodySkew}deg)`

  const orangeTransform = errorPose
    ? 'skewX(-6deg)'
    : showingPassword
      ? 'skewX(0deg)'
      : typingEmail
        ? `skewX(${orangePos.bodySkew * 1.3}deg) translateY(-6px) scale(1.03)`
        : `skewX(${orangePos.bodySkew}deg)`

  const yellowTransform = errorPose
    ? 'skewX(6deg)'
    : showingPassword
      ? 'skewX(0deg)'
      : typingEmail
        ? `skewX(${yellowPos.bodySkew * 1.3}deg) translateY(-6px) scale(1.03)`
        : `skewX(${yellowPos.bodySkew}deg)`

  return (
    <div className="auth-characters-scene">
      <div className="auth-character auth-char-purple" style={{ transform: purpleTransform, height: lookingAway || typingEmail ? 410 : 370 }}>
        <div
          className={`auth-eyes${errorPose ? ' auth-shake-head' : ''}`}
          style={{
            left: errorPose ? 30 : lookingAway ? 20 : showingPassword ? 20 : 45 + purplePos.faceX,
            top: errorPose ? 55 : lookingAway ? 25 : showingPassword ? 35 : 40 + purplePos.faceY,
            gap: 28,
          }}
        >
          <div className="auth-eyeball" style={{ width: 18, height: purpleBlinking ? 2 : 18 }}>
            <div
              className="auth-pupil"
              style={{
                width: 7,
                height: 7,
                transform: errorPose
                  ? 'translate(-3px, 4px)'
                  : lookingAway
                    ? 'translate(-5px, -5px)'
                    : showingPassword
                      ? `translate(${purplePeeking ? 4 : -4}px, ${purplePeeking ? 5 : -4}px)`
                      : `translate(${purplePupil.x}px, ${purplePupil.y}px)`,
              }}
            />
          </div>
          <div className="auth-eyeball" style={{ width: 18, height: purpleBlinking ? 2 : 18 }}>
            <div
              className="auth-pupil"
              style={{
                width: 7,
                height: 7,
                transform: errorPose
                  ? 'translate(-3px, 4px)'
                  : lookingAway
                    ? 'translate(-5px, -5px)'
                    : showingPassword
                      ? `translate(${purplePeeking ? 4 : -4}px, ${purplePeeking ? 5 : -4}px)`
                      : `translate(${purplePupil.x}px, ${purplePupil.y}px)`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="auth-character auth-char-black" style={{ transform: blackTransform }}>
        <div
          className={`auth-eyes${errorPose ? ' auth-shake-head' : ''}`}
          style={{
            left: errorPose ? 15 : lookingAway ? 10 : showingPassword ? 10 : 26 + blackPos.faceX,
            top: errorPose ? 40 : lookingAway ? 20 : showingPassword ? 28 : 32 + blackPos.faceY,
            gap: 20,
          }}
        >
          <div className="auth-eyeball" style={{ width: 16, height: blackBlinking ? 2 : 16 }}>
            <div
              className="auth-pupil"
              style={{
                width: 6,
                height: 6,
                transform: errorPose
                  ? 'translate(-3px, 4px)'
                  : lookingAway
                    ? 'translate(-4px, -5px)'
                    : showingPassword
                      ? 'translate(-4px, -4px)'
                      : `translate(${blackPupil.x}px, ${blackPupil.y}px)`,
              }}
            />
          </div>
          <div className="auth-eyeball" style={{ width: 16, height: blackBlinking ? 2 : 16 }}>
            <div
              className="auth-pupil"
              style={{
                width: 6,
                height: 6,
                transform: errorPose
                  ? 'translate(-3px, 4px)'
                  : lookingAway
                    ? 'translate(-4px, -5px)'
                    : showingPassword
                      ? 'translate(-4px, -4px)'
                      : `translate(${blackPupil.x}px, ${blackPupil.y}px)`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="auth-character auth-char-orange" style={{ transform: orangeTransform }}>
        <div
          className={`auth-eyes${errorPose ? ' auth-shake-head' : ''}`}
          style={{
            left: errorPose ? 60 : lookingAway ? 50 : showingPassword ? 50 : 82 + orangePos.faceX,
            top: errorPose ? 95 : lookingAway ? 75 : showingPassword ? 85 : 90 + orangePos.faceY,
            gap: 28,
          }}
        >
          <div
            className="auth-bare-pupil"
            style={{
              transform: errorPose
                ? 'translate(-3px, 4px)'
                : lookingAway
                  ? 'translate(-5px, -5px)'
                  : showingPassword
                    ? 'translate(-5px, -4px)'
                    : `translate(${orangePupil.x}px, ${orangePupil.y}px)`,
            }}
          />
          <div
            className="auth-bare-pupil"
            style={{
              transform: errorPose
                ? 'translate(-3px, 4px)'
                : lookingAway
                  ? 'translate(-5px, -5px)'
                  : showingPassword
                    ? 'translate(-5px, -4px)'
                    : `translate(${orangePupil.x}px, ${orangePupil.y}px)`,
            }}
          />
        </div>
        <div
          className={`auth-orange-mouth${errorPose ? ' auth-orange-mouth-visible auth-shake-head' : ''}`}
          style={{ left: errorPose ? 80 + orangePos.faceX : 90, top: errorPose ? 130 : 120 }}
        />
      </div>

      <div className="auth-character auth-char-yellow" style={{ transform: yellowTransform }}>
        <div
          className={`auth-eyes${errorPose ? ' auth-shake-head' : ''}`}
          style={{
            left: errorPose ? 35 : lookingAway ? 20 : showingPassword ? 20 : 52 + yellowPos.faceX,
            top: errorPose ? 45 : lookingAway ? 30 : showingPassword ? 35 : 40 + yellowPos.faceY,
            gap: 20,
          }}
        >
          <div
            className="auth-bare-pupil"
            style={{
              transform: errorPose
                ? 'translate(-3px, 4px)'
                : lookingAway
                  ? 'translate(-5px, -5px)'
                  : showingPassword
                    ? 'translate(-5px, -4px)'
                    : `translate(${yellowPupil.x}px, ${yellowPupil.y}px)`,
            }}
          />
          <div
            className="auth-bare-pupil"
            style={{
              transform: errorPose
                ? 'translate(-3px, 4px)'
                : lookingAway
                  ? 'translate(-5px, -5px)'
                  : showingPassword
                    ? 'translate(-5px, -4px)'
                    : `translate(${yellowPupil.x}px, ${yellowPupil.y}px)`,
            }}
          />
        </div>
        <div
          className={`auth-yellow-mouth${errorPose ? ' auth-shake-head' : ''}`}
          style={{
            left: errorPose ? 30 : lookingAway ? 15 : showingPassword ? 10 : 40 + yellowPos.faceX,
            top: errorPose ? 92 : lookingAway ? 78 : showingPassword ? 88 : 88 + yellowPos.faceY,
            transform: errorPose ? 'rotate(-8deg)' : 'rotate(0deg)',
          }}
        />
      </div>
    </div>
  )
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<TabId>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)
  const [successLabel, setSuccessLabel] = useState('')
  const [errorPose, setErrorPose] = useState(false)
  const [mouse, setMouse] = useState<MousePoint>({ x: 640, y: 360 })
  const successTimerRef = useRef<number | null>(null)

  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      setMouse({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    setShowPassword(false)
    setError('')
    setMessage('')
    setAuthSuccess(false)
    setSuccessLabel('')
  }, [tab])

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const finishEntry = (successText: string) => {
    setAuthSuccess(true)
    setSuccessLabel(successText)
    setMessage(successText)

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current)
    }

    successTimerRef.current = window.setTimeout(() => {
      beginEntryPrologue(redirect)
      navigate('/prologue', { replace: true })
    }, 720)
  }

  const triggerErrorPose = () => {
    setErrorPose(true)
    window.setTimeout(() => {
      setErrorPose(false)
    }, 2500)
  }

  const showError = (nextError: string) => {
    setAuthSuccess(false)
    setSuccessLabel('')
    setMessage('')
    setError(nextError)
    triggerErrorPose()
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim()) {
      showError('请输入邮箱。')
      return
    }

    if (!password.trim()) {
      showError('请输入密码。')
      return
    }

    setSubmitting(true)
    const result = await loginUser({ email, password })
    setSubmitting(false)

    if (!result.ok) {
      showError(result.message)
      return
    }

    finishEntry('登录成功，欢迎回来。')
  }

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!name.trim()) {
      showError('请输入昵称。')
      return
    }

    if (!email.trim()) {
      showError('请输入邮箱。')
      return
    }

    if (password.trim().length < 6) {
      showError('密码至少需要 6 位。')
      return
    }

    setSubmitting(true)
    const result = await registerUser({ name, email, password })
    setSubmitting(false)

    if (!result.ok) {
      showError(result.message)
      return
    }

    finishEntry('注册成功，已为你进入系统。')
  }

  const handleGuest = () => {
    setError('')
    setMessage('')
    enterGuestMode()
    finishEntry('访客模式已开启，正在进入站点。')
  }

  const currentTitle = tab === 'login' ? '欢迎回来' : tab === 'register' ? '创建账号' : '访客进入'
  const currentSubtitle =
    tab === 'login'
      ? '请输入邮箱和密码，继续探索内容。'
      : tab === 'register'
        ? '创建一个账号，保存你的收藏与学习进度。'
        : '无需注册，先以访客身份浏览内容。'

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          background: #3f2a22;
          overflow: hidden;
        }
        
        .auth-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        .auth-left-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #8f2d24 0%, #a63b2d 38%, #b86b37 72%, #d0a05b 100%);
          padding: 40px 48px;
          overflow: hidden;
        }

        .auth-left-panel::before {
          content: '';
          position: absolute;
          bottom: 15%;
          left: 10%;
          width: 350px;
          height: 350px;
          background: rgba(248, 222, 186, 0.16);
          border-radius: 50%;
          filter: blur(100px);
        }

        .auth-left-panel::after {
          content: '';
          position: absolute;
          top: 20%;
          right: 15%;
          width: 260px;
          height: 260px;
          background: rgba(122, 28, 23, 0.24);
          border-radius: 50%;
          filter: blur(80px);
        }

        .auth-logo,
        .auth-footer-links {
          position: relative;
          z-index: 2;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 16px;
          font-family: 'STZhongsong', 'Songti SC', var(--font-serif);
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .auth-logo-badge {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 244, 225, 0.18);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        .auth-hero-copy {
          position: relative;
          z-index: 2;
          margin-top: 36px;
          max-width: 420px;
        }

        .auth-hero-copy h1 {
          margin: 0 0 12px;
          font-size: clamp(40px, 5vw, 56px);
          line-height: 0.98;
          font-family: 'STZhongsong', 'Songti SC', var(--font-serif);
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #ffffff;
          text-shadow: 0 10px 30px rgba(74, 26, 18, 0.22);
        }

        .auth-hero-copy p {
          margin: 0;
          font-size: 15px;
          line-height: 1.9;
          letter-spacing: 0.12em;
          color: rgba(255, 243, 226, 0.82);
        }

        .auth-characters-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          flex: 1;
          min-height: 420px;
        }

        .auth-characters-scene {
          position: relative;
          width: 480px;
          height: 360px;
        }

        .auth-character {
          position: absolute;
          bottom: 0;
          transform-origin: bottom center;
          transition: all 0.7s ease-in-out;
        }

        .auth-char-purple {
          left: 60px;
          width: 170px;
          height: 370px;
          background: #8b352d;
          border-radius: 10px 10px 0 0;
          z-index: 1;
        }

        .auth-char-black {
          left: 220px;
          width: 115px;
          height: 290px;
          background: #2f241e;
          border-radius: 8px 8px 0 0;
          z-index: 2;
        }

        .auth-char-orange {
          left: 0;
          width: 230px;
          height: 190px;
          background: #c9783d;
          border-radius: 115px 115px 0 0;
          z-index: 3;
        }

        .auth-char-yellow {
          left: 290px;
          width: 135px;
          height: 215px;
          background: #d0ab63;
          border-radius: 68px 68px 0 0;
          z-index: 4;
        }

        .auth-eyes {
          position: absolute;
          display: flex;
          transition: all 0.7s ease-in-out;
        }

        .auth-eyeball {
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: height 0.15s ease;
          overflow: hidden;
        }

        .auth-pupil,
        .auth-bare-pupil {
          border-radius: 50%;
          background: #2f241e;
          transition: transform 0.15s ease-out;
        }

        .auth-bare-pupil {
          width: 12px;
          height: 12px;
        }

        .auth-yellow-mouth {
          position: absolute;
          width: 50px;
          height: 4px;
          background: #2f241e;
          border-radius: 2px;
          transition: all 0.7s ease-in-out;
        }

        .auth-orange-mouth {
          position: absolute;
          width: 28px;
          height: 14px;
          border: 3px solid #2f241e;
          border-top: none;
          border-radius: 0 0 14px 14px;
          opacity: 0;
          transition: all 0.7s ease-in-out;
        }

        .auth-orange-mouth-visible {
          opacity: 1;
        }

        @keyframes auth-shake-head {
          0%, 100% { translate: 0 0; }
          10% { translate: -9px 0; }
          20% { translate: 7px 0; }
          30% { translate: -6px 0; }
          40% { translate: 5px 0; }
          50% { translate: -4px 0; }
          60% { translate: 3px 0; }
          70% { translate: -2px 0; }
          80% { translate: 1px 0; }
          90% { translate: -0.5px 0; }
        }

        .auth-shake-head {
          animation: auth-shake-head 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .auth-footer-links {
          display: flex;
          gap: 28px;
          font-size: 13px;
          color: rgba(93, 51, 34, 0.78);
        }

        .auth-footer-links span {
          transition: color 0.2s;
          cursor: default;
        }

        .auth-footer-links span:hover {
          color: #4f2d20;
        }

        .auth-right-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5eee2;
          padding: 40px;
        }

        .auth-form-shell {
          width: 100%;
          max-width: 400px;
        }

        .auth-sparkle {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .auth-form-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .auth-form-header h2 {
          margin: 0 0 6px;
          font-size: 28px;
          font-family: 'STZhongsong', 'Songti SC', var(--font-serif);
          font-weight: 700;
          color: #4f2d20;
          letter-spacing: 0.08em;
        }

        .auth-form-header p {
          margin: 0;
          font-size: 14px;
          color: #8d6b56;
          letter-spacing: 0.04em;
        }

        .auth-tab-switcher {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 24px;
          padding: 6px;
          border: 1px solid #e1cfb6;
          border-radius: 999px;
          background: #efe3d0;
        }

        .auth-tab-switcher button {
          height: 40px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: #8a6a54;
          font-size: 13px;
          font-family: 'Songti SC', var(--font-serif);
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .auth-tab-switcher button.auth-tab-active {
          background: #7a2e22;
          color: #ffffff;
          box-shadow: 0 10px 20px rgba(122, 46, 34, 0.22);
        }

        .auth-form-group {
          margin-bottom: 20px;
        }

        .auth-form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-family: 'Songti SC', var(--font-serif);
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #5d3a2a;
        }

        .auth-input-wrap {
          position: relative;
          border-radius: 18px;
          transform: translateY(0);
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1), background-color 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .auth-input-wrap input {
          width: 100%;
          height: 48px;
          border: none;
          border-bottom: 1.5px solid #d6c1a6;
          padding: 0 42px 0 0;
          background: transparent;
          color: #3f2a22;
          font-size: 15px;
          outline: none;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .auth-input-wrap:focus-within {
          transform: translateY(-3px);
          box-shadow: 0 18px 36px -28px rgba(122, 46, 34, 0.3);
        }

        .auth-input-wrap input:focus {
          border-bottom-color: #9c3f2d;
          box-shadow: inset 0 -1px 0 #9c3f2d;
        }

        .auth-input-wrap input::placeholder {
          color: #b39a81;
        }

        .auth-input-wrap input.auth-input-error {
          border-bottom-color: #dc2626;
        }

        .auth-toggle-password {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #8a6a54;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .auth-toggle-password:hover {
          color: #5d3a2a;
        }

        .auth-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          font-size: 13px;
          color: #7a5e4a;
        }

        .auth-info-row span:last-child {
          color: #9c3f2d;
          font-weight: 500;
        }

        .auth-error-msg,
        .auth-success-msg {
          margin-bottom: 16px;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          backdrop-filter: blur(12px);
          animation: auth-status-in 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .auth-error-msg {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.08);
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .auth-success-msg {
          color: #0f766e;
          background: rgba(15, 118, 110, 0.08);
          border: 1px solid rgba(15, 118, 110, 0.16);
        }

        .auth-primary-btn,
        .auth-secondary-btn {
          position: relative;
          width: 100%;
          height: 50px;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          overflow: hidden;
          transform: translateY(0) scale(1);
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 260ms cubic-bezier(0.22, 1, 0.36, 1), background-color 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease;
        }

        .auth-primary-btn {
          margin-bottom: 14px;
          border: 1.5px solid #7a2e22;
          background: #7a2e22;
          color: #fff;
          box-shadow: 0 18px 36px -24px rgba(122, 46, 34, 0.45);
        }

        .auth-secondary-btn {
          border: 1.5px solid #d6c1a6;
          background: #efe4d4;
          color: #5d3a2a;
          box-shadow: 0 16px 34px -28px rgba(93, 58, 42, 0.28);
        }

        .auth-primary-btn:disabled,
        .auth-secondary-btn:disabled {
          opacity: 0.75;
          cursor: wait;
        }

        .auth-btn-text {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .auth-btn-hover {
          position: absolute;
          inset: 0;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #b66a2c;
          color: #fff;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .auth-primary-btn:hover .auth-btn-text,
        .auth-secondary-btn:hover .auth-btn-text {
          transform: translateX(40px);
          opacity: 0;
        }

        .auth-primary-btn:hover,
        .auth-secondary-btn:hover {
          transform: translateY(-2px) scale(1.015);
        }

        .auth-primary-btn:active,
        .auth-secondary-btn:active {
          transform: translateY(0) scale(0.982);
        }

        .auth-primary-btn:hover .auth-btn-hover,
        .auth-secondary-btn:hover .auth-btn-hover {
          opacity: 1;
        }

        .auth-primary-btn.auth-success-state,
        .auth-secondary-btn.auth-success-state {
          border-color: rgba(15, 118, 110, 0.6);
          background: linear-gradient(135deg, rgba(15, 118, 110, 0.96), rgba(20, 184, 166, 0.92));
          color: #ffffff;
          box-shadow: 0 26px 50px -30px rgba(15, 118, 110, 0.58);
        }

        .auth-primary-btn.auth-success-state .auth-btn-text,
        .auth-secondary-btn.auth-success-state .auth-btn-text {
          opacity: 0;
          transform: translateY(-14px);
        }

        .auth-primary-btn.auth-success-state .auth-btn-hover,
        .auth-secondary-btn.auth-success-state .auth-btn-hover {
          opacity: 1;
          background: linear-gradient(135deg, rgba(15, 118, 110, 0.98), rgba(20, 184, 166, 0.94));
        }

        .auth-guest-card {
          margin-bottom: 18px;
          border: 1px solid #e1cfb6;
          border-radius: 18px;
          padding: 18px;
          background: #fbf6ee;
        }

        .auth-guest-card h3 {
          margin: 0 0 8px;
          font-size: 15px;
          color: #4f2d20;
        }

        .auth-guest-card p,
        .auth-guest-list {
          margin: 0;
          font-size: 13px;
          line-height: 1.8;
          color: #7a5e4a;
        }

        .auth-guest-list {
          padding-left: 18px;
        }

        .auth-bottom-link {
          margin-top: 32px;
          text-align: center;
          font-size: 13px;
          color: #9a7d65;
        }

        .auth-bottom-link button {
          border: none;
          background: transparent;
          color: #7a2e22;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
        }

        .auth-bottom-note {
          margin-top: 18px;
          text-align: center;
          font-size: 12px;
          color: #a48a73;
        }

        .dark .auth-page {
          background: #120f0d;
        }

        .dark .auth-left-panel {
          background: linear-gradient(145deg, #4e1917 0%, #62241f 34%, #714322 70%, #8a6736 100%);
        }

        .dark .auth-left-panel::before {
          background: rgba(203, 162, 94, 0.14);
        }

        .dark .auth-left-panel::after {
          background: rgba(44, 16, 13, 0.34);
        }

        .dark .auth-logo-badge {
          background: rgba(255, 241, 219, 0.12);
        }

        .dark .auth-right-panel {
          background: #181411;
        }

        .dark .auth-form-shell {
          border: 1px solid rgba(203, 174, 132, 0.12);
          border-radius: 32px;
          padding: 28px 26px;
          background: linear-gradient(180deg, rgba(28, 23, 19, 0.94), rgba(18, 15, 13, 0.96));
          box-shadow: 0 28px 70px -40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 240, 215, 0.05);
        }

        .dark .auth-form-header h2,
        .dark .auth-form-group label,
        .dark .auth-guest-card h3 {
          color: #f2e6d1;
        }

        .dark .auth-form-header p,
        .dark .auth-bottom-link,
        .dark .auth-bottom-note,
        .dark .auth-guest-card p,
        .dark .auth-guest-list,
        .dark .auth-info-row {
          color: #bca58e;
        }

        .dark .auth-tab-switcher {
          border-color: rgba(203, 174, 132, 0.12);
          background: rgba(255, 244, 224, 0.06);
        }

        .dark .auth-tab-switcher button {
          color: #bca58e;
        }

        .dark .auth-tab-switcher button.auth-tab-active {
          background: #9d4a2d;
          box-shadow: 0 14px 30px -18px rgba(157, 74, 45, 0.65);
        }

        .dark .auth-input-wrap input {
          border-bottom-color: rgba(203, 174, 132, 0.3);
          color: #f2e6d1;
        }

        .dark .auth-input-wrap input:focus {
          border-bottom-color: #c78f4f;
          box-shadow: inset 0 -1px 0 #c78f4f;
        }

        .dark .auth-input-wrap input::placeholder {
          color: #8f7864;
        }

        .dark .auth-toggle-password {
          color: #bca58e;
        }

        .dark .auth-toggle-password:hover,
        .dark .auth-bottom-link button {
          color: #e0b270;
        }

        .dark .auth-primary-btn {
          border-color: #9d4a2d;
          background: #9d4a2d;
        }

        .dark .auth-secondary-btn {
          border-color: rgba(203, 174, 132, 0.2);
          background: rgba(255, 244, 224, 0.06);
          color: #f0dfc6;
        }

        .dark .auth-btn-hover {
          background: #c48644;
        }

        .dark .auth-guest-card {
          border-color: rgba(203, 174, 132, 0.12);
          background: rgba(255, 244, 224, 0.04);
        }

        @keyframes auth-status-in {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1200px) {
          .auth-left-panel {
            padding: 36px 36px 32px;
          }

          .auth-characters-scene {
            width: 420px;
            transform: scale(0.9);
            transform-origin: center bottom;
          }
        }

        @media (max-width: 1024px) {
          .auth-layout {
            grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.88fr);
          }

          .auth-left-panel {
            padding: 32px 28px 28px;
          }

          .auth-right-panel {
            padding: 28px 24px;
          }

          .auth-form-shell {
            max-width: 380px;
          }

          .dark .auth-form-shell {
            padding: 24px 22px;
          }

          .auth-hero-copy h1 {
            font-size: clamp(34px, 4.4vw, 46px);
          }

          .auth-characters-wrapper {
            min-height: 340px;
          }

          .auth-characters-scene {
            width: 360px;
            height: 300px;
            transform: scale(0.8);
          }
        }

        @media (max-width: 900px) {
          .auth-layout {
            grid-template-columns: 1fr;
          }

          .auth-left-panel {
            display: none;
          }

          .auth-right-panel {
            padding: 28px 22px;
          }

          .auth-form-shell,
          .dark .auth-form-shell {
            max-width: 460px;
            padding: 0;
            border: none;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
          }
        }

        @media (max-width: 767px) {
          .auth-right-panel {
            align-items: flex-start;
            min-height: 100vh;
            padding: 88px 18px 28px;
          }

          .auth-form-shell {
            max-width: none;
          }

          .auth-form-header h2 {
            font-size: 24px;
          }

          .auth-form-header p {
            font-size: 13px;
            line-height: 1.7;
          }

          .auth-tab-switcher {
            gap: 6px;
            padding: 5px;
          }

          .auth-tab-switcher button {
            height: 44px;
          }

          .auth-primary-btn,
          .auth-secondary-btn {
            height: 52px;
          }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-layout">
          <section className="auth-left-panel">
            <div className="auth-logo">
                <div className="auth-logo-badge">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2L15 9H9L12 2Z" />
                    <path d="M12 22L9 15H15L12 22Z" />
                    <path d="M2 12L9 9V15L2 12Z" />
                    <path d="M22 12L15 15V9L22 12Z" />
                  </svg>
                </div>
                <span>文创灵感</span>
              </div>

              <div className="auth-hero-copy">
                <h1>营造新途</h1>
                <p>观千年营造，览东方风华。</p>
              </div>

            <div className="auth-characters-wrapper">
              <CharacterScene
                nameFocused={nameFocused}
                emailFocused={emailFocused}
                passwordFocused={passwordFocused}
                showPassword={showPassword}
                passwordLength={password.length}
                errorPose={errorPose}
                mouse={mouse}
              />
            </div>

            <div className="auth-footer-links" />
          </section>

          <section className="auth-right-panel">
            <motion.div className="auth-form-shell" initial="initial" animate="animate" variants={modalVariants}>
              <motion.div className="auth-sparkle" initial="initial" animate="animate" variants={overlayVariants}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                  <path d="M12 2L13.5 9H10.5L12 2Z" fill="#7a2e22" />
                  <path d="M12 22L10.5 15H13.5L12 22Z" fill="#7a2e22" />
                  <path d="M2 12L9 10.5V13.5L2 12Z" fill="#7a2e22" />
                  <path d="M22 12L15 13.5V10.5L22 12Z" fill="#7a2e22" />
                </svg>
              </motion.div>

              <div className="auth-form-header">
                <h2>{currentTitle}</h2>
                <p>{currentSubtitle}</p>
              </div>

              <div className="auth-tab-switcher">
                <motion.button className={tab === 'login' ? 'auth-tab-active' : ''} onClick={() => setTab('login')} type="button" whileHover={hoverLift} whileTap={tapPress}>
                  登录
                </motion.button>
                <motion.button className={tab === 'register' ? 'auth-tab-active' : ''} onClick={() => setTab('register')} type="button" whileHover={hoverLift} whileTap={tapPress}>
                  注册
                </motion.button>
                <motion.button className={tab === 'guest' ? 'auth-tab-active' : ''} onClick={() => setTab('guest')} type="button" whileHover={hoverLift} whileTap={tapPress}>
                  访客
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div key={`error-${error}`} className="auth-error-msg" initial="initial" animate="animate" exit="exit" variants={dropdownVariants}>
                    {error}
                  </motion.div>
                ) : null}
                {!error && message ? (
                  <motion.div key={`message-${message}`} className="auth-success-msg" initial="initial" animate="animate" exit="exit" variants={dropdownVariants}>
                    {message}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.form key="login-form" onSubmit={handleLogin} initial="initial" animate="animate" exit="exit" variants={dropdownVariants}>
                  <div className="auth-form-group">
                    <label htmlFor="auth-email">邮箱</label>
                    <div className="auth-input-wrap">
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        className={error ? 'auth-input-error' : ''}
                        placeholder="请输入邮箱"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="auth-password">密码</label>
                    <div className="auth-input-wrap">
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        className={error ? 'auth-input-error' : ''}
                        placeholder="请输入密码"
                        autoComplete="current-password"
                      />
                      <motion.button
                        type="button"
                        className="auth-toggle-password"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? '隐藏密码' : '显示密码'}
                        whileHover={hoverLift}
                        whileTap={tapPress}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <motion.button className={`auth-primary-btn${authSuccess ? ' auth-success-state' : ''}`} type="submit" disabled={submitting || authSuccess} whileHover={hoverLift} whileTap={tapPress}>
                    <span className="auth-btn-text">{submitting ? '登录中...' : '登录'}</span>
                    <span className="auth-btn-hover">
                      <span>{authSuccess ? successLabel : submitting ? '登录中...' : '登录'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </motion.button>
                </motion.form>
              ) : null}

              {tab === 'register' ? (
                <motion.form key="register-form" onSubmit={handleRegister} initial="initial" animate="animate" exit="exit" variants={dropdownVariants}>
                  <div className="auth-form-group">
                    <label htmlFor="auth-name">昵称</label>
                    <div className="auth-input-wrap">
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        onFocus={() => setNameFocused(true)}
                        onBlur={() => setNameFocused(false)}
                        placeholder="请输入昵称"
                        autoComplete="nickname"
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="auth-register-email">邮箱</label>
                    <div className="auth-input-wrap">
                      <input
                        id="auth-register-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        className={error ? 'auth-input-error' : ''}
                        placeholder="请输入邮箱"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="auth-register-password">密码</label>
                    <div className="auth-input-wrap">
                      <input
                        id="auth-register-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        className={error ? 'auth-input-error' : ''}
                        placeholder="至少 6 位密码"
                        autoComplete="new-password"
                      />
                      <motion.button
                        type="button"
                        className="auth-toggle-password"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? '隐藏密码' : '显示密码'}
                        whileHover={hoverLift}
                        whileTap={tapPress}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <motion.button className={`auth-primary-btn${authSuccess ? ' auth-success-state' : ''}`} type="submit" disabled={submitting || authSuccess} whileHover={hoverLift} whileTap={tapPress}>
                    <span className="auth-btn-text">{submitting ? '创建中...' : '注册'}</span>
                    <span className="auth-btn-hover">
                      <span>{authSuccess ? successLabel : submitting ? '创建中...' : '注册'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </motion.button>
                </motion.form>
              ) : null}

              {tab === 'guest' ? (
                <motion.div key="guest-form" initial="initial" animate="animate" exit="exit" variants={dropdownVariants}>
                  <div className="auth-guest-card">
                    <h3>访客模式</h3>
                    <p>你可以先浏览站点并体验核心内容，之后再决定是否创建账号。</p>
                  </div>

                  <div className="auth-guest-card">
                    <ol className="auth-guest-list">
                      <li>可先浏览主要页面与学习内容。</li>
                      <li>浏览器清理后，本地进度可能会丢失。</li>
                      <li>之后你仍可随时切换到正式账号。</li>
                    </ol>
                  </div>

                  {/*
                  <div className="auth-guest-card">
                    <h3>访客模式</h3>
                    <p>你可以先进入站点浏览内容与互动体验，不需要立即创建账号。</p>
                  </div>

                  <div className="auth-guest-card">
                    <ol className="auth-guest-list">
                      <li>可以浏览主要内容和页面。</li>
                      <li>本地记录可能会在清理浏览器后丢失。</li>
                      <li>后续仍可切换为正式注册账号。</li>
                    </ol>
                  </div>

                  */}

                  <motion.button className={`auth-secondary-btn${authSuccess ? ' auth-success-state' : ''}`} type="button" onClick={handleGuest} whileHover={hoverLift} whileTap={tapPress} disabled={authSuccess}>
                    <span className="auth-btn-text">以访客身份进入</span>
                    <span className="auth-btn-hover">
                      <span>{authSuccess ? successLabel : '以访客身份进入'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </motion.button>
                </motion.div>
              ) : null}
              </AnimatePresence>

              <div className="auth-bottom-link">
                {tab === 'login' ? (
                  <>
                    还没有账号？
                    <motion.button type="button" onClick={() => setTab('register')} whileHover={hoverLift} whileTap={tapPress}>
                      去注册
                    </motion.button>
                  </>
                ) : tab === 'register' ? (
                  <>
                    已有账号？
                    <motion.button type="button" onClick={() => setTab('login')} whileHover={hoverLift} whileTap={tapPress}>
                      去登录
                    </motion.button>
                  </>
                ) : (
                  <>
                    想同步你的进度？
                    <motion.button type="button" onClick={() => setTab('register')} whileHover={hoverLift} whileTap={tapPress}>
                      创建账号
                    </motion.button>
                  </>
                )}
              </div>

              <div className="auth-bottom-note">
                {isAuthenticated() ? '当前已登录，可直接进入系统。' : '请选择登录、注册或访客模式进入。'}
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  )
}
