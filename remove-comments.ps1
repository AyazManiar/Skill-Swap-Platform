# PowerShell script to remove comments from JavaScript and JSX files
$projectPath = "c:\Users\MY PC\Github Projects\Skill-Swap-Platform"
$files = Get-ChildItem -Recurse -Include "*.js", "*.jsx" -Path "$projectPath\client\src", "$projectPath\server" | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read file content
    $content = Get-Content $file.FullName -Raw
    
    # Remove single-line comments (// comments)
    # This regex matches // followed by anything until end of line, but not inside strings
    $content = $content -replace '(?<!["''`])//.*?(?=\r?\n|$)', ''
    
    # Remove multi-line comments (/* */ comments)
    # This regex matches /* followed by anything (including newlines) until */
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    
    # Remove empty lines that were left after comment removal
    $content = $content -replace '(?m)^\s*\r?\n', ''
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Processed: $($file.Name)"
}

Write-Host "Comment removal completed for all files!"
