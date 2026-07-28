export function getSessionId() {
  let sessionId = localStorage.getItem("lumifit_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("lumifit_session_id", sessionId);
  }

  return sessionId;
}