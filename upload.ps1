param([string]$host, [string]$user, [string]$pass, [string]$file)
$cred = New-Object System.Management.Automation.PSCredential($user, (ConvertTo-SecureString $pass -AsPlainText -Force))
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.Credentials = $cred
$uri = " http://$host/upload\
Invoke-RestMethod -Uri $uri -Method Post -Body (Get-Content $file) -SessionVariable session
