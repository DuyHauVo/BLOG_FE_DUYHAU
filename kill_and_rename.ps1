$port = 3000
$tcpConnections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($tcpConnections) {
    foreach ($conn in $tcpConnections) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2
Rename-Item -Path "src\app\client" -NewName "(client)" -Force
Remove-Item -Path "src\app\page.tsx" -Force -ErrorAction SilentlyContinue
