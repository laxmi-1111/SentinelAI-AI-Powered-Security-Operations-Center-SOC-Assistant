from collections import defaultdict
from datetime import timedelta

from app.models import Alert, LogEvent


class DetectionEngine:
    def __init__(self) -> None:
        self.recent_events: dict[str, list[LogEvent]] = defaultdict(list)
        self.suspicious_ips = {"10.10.10.10", "185.220.101.1"}

    def detect(self, event: LogEvent) -> list[Alert]:
        events = self.recent_events[event.ip]
        cutoff = event.timestamp - timedelta(seconds=60)
        events[:] = [item for item in events if item.timestamp >= cutoff]
        events.append(event)

        alerts: list[Alert] = []
        failed_logins = [
            item for item in events
            if item.event_type == "login" and item.status.lower() == "failed"
        ]
        if len(failed_logins) >= 5:
            usernames = sorted({item.username for item in failed_logins if item.username})
            score = min(100, 60 + (20 if len(usernames) > 1 else 0) + (25 if event.ip in self.suspicious_ips else 0))
            alerts.append(Alert(
                timestamp=event.timestamp,
                ip=event.ip,
                threat_type="Brute Force Attack",
                severity=self._severity(score),
                risk_score=score,
                evidence=[
                    f"{len(failed_logins)} failed login attempts from {event.ip} in 60 seconds",
                    f"Targeted accounts: {', '.join(usernames) or 'unknown'}",
                ],
            ))

        if event.ip in self.suspicious_ips:
            alerts.append(Alert(
                timestamp=event.timestamp,
                ip=event.ip,
                threat_type="Suspicious Source IP",
                severity="HIGH",
                risk_score=85,
                evidence=[f"IP {event.ip} matched the local threat-intelligence watchlist"],
            ))
        return alerts

    @staticmethod
    def _severity(score: int) -> str:
        if score >= 80:
            return "CRITICAL"
        if score >= 60:
            return "HIGH"
        if score >= 30:
            return "MEDIUM"
        return "LOW"
