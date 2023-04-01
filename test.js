const html = `<div><p>and that the Aboriginal people see the sky as reflecting life on the land.</p>\n<p><br/></p></div>`

console.log(JSON.stringify(html
    ?.replaceAll(/<div>(.+?)<\/div>/g, '$1')
    ?.replaceAll(/^<p>(.+?)<\/p>$/g, '<span>$1</span>')
    ?.replaceAll(/^<p>(.+?)<\/p>\n+/g, '<span>$1</span><br>')
    ?.replaceAll(/\n+<p>(.+?)<\/p>$/g, '<br><span>$1</span>')
))