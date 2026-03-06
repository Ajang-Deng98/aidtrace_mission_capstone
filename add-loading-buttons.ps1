# Add LoadingButton to all pages
$pages = @(
    "Register.js",
    "ForgotPassword.js", 
    "ResetPassword.js"
)

foreach ($page in $pages) {
    $file = "c:\dev\aidtrace_project\frontend\src\pages\$page"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Add import if not exists
        if ($content -notmatch "LoadingButton") {
            $content = $content -replace "(import.*from.*api';)", "`$1`r`nimport LoadingButton from '../components/LoadingButton';"
            
            # Add loading state
            $content = $content -replace "(\[.*\]\s*=\s*useState\(\{[^}]+\}\);)", "`$1`r`n  const [loading, setLoading] = useState(false);"
            
            # Update handleSubmit to use loading
            $content = $content -replace "(const handleSubmit = async \(e\) => \{[\r\n\s]+e\.preventDefault\(\);)", "`$1`r`n    setLoading(true);`r`n    setError('');"
            
            # Add setLoading(false) in catch
            $content = $content -replace "(\} catch \(err\) \{[\r\n\s]+setError\([^)]+\);)", "`$1`r`n      setLoading(false);"
            
            # Replace button with LoadingButton
            $content = $content -replace '<button type="submit"([^>]+)>([^<]+)</button>', '<LoadingButton type="submit" loading={loading}$1>$2</LoadingButton>'
            
            Set-Content $file $content -NoNewline
            Write-Host "Updated $page"
        }
    }
}

Write-Host "Done!"
