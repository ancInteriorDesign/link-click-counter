// http://localhost:5500/?gistId=5c1d203a6a14a65d57a1edaf7235ca3d&&token=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&&fileName=instagram-click-gist&&redirect=https://www.instagram.com/anc.architects
//? https://ancinteriordesign.github.io/link-click-counter/?gistId=5c1d203a6a14a65d57a1edaf7235ca3d&&token=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&&fileName=instagram-click-gist&&redirect=https://www.instagram.com/anc.architects
// const gistId = '5c1d203a6a14a65d57a1edaf7235ca3d';
// const token = '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';
// const fileName = 'instagram-click-gist';
let gistId,  fileName;
const token=  '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'

async function fetchGistData() {
    try {
        const url = `https://api.github.com/gists/${gistId}`;
        const response = await fetch(url, {
            headers: {
                Authorization: token ? `token ${token}` : undefined, // Use token only if defined
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch Gist data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Gist data:', error.message);
        throw error;
    }
}
async function fetchGistFileContent(fileName) {
    try {
        const gistData = await fetchGistData();
        const fileContent = gistData.files[fileName]?.content;
        if (!fileContent) {
            throw new Error(`File "${fileName}" not found in the Gist`);
        }
        return JSON.parse(fileContent.trim());
    } catch (error) {
        console.error(`Error fetching file "${fileName}" content:`, error.message);
        throw error;
    }
}
async function updateGistFileContent( fileName, newContent) {
    try {
        const gistData = await fetchGistData();
        const fileContent = gistData.files[fileName]?.content;
        if (!fileContent) {
            throw new Error(`File "${fileName}" not found in the Gist`);
        }

        // Assume file content is JSON; merge arrays or update as needed
        const parsedContent = JSON.parse(fileContent.trim());
        const updatedContent = Array.isArray(parsedContent)
            ? [...parsedContent, ...newContent]
            : newContent;

        const url = `https://api.github.com/gists/${gistId}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: {
                    [fileName]: { content: JSON.stringify(updatedContent, null, 2) },
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update Gist: ${response.statusText}`);
        }
        // console.log(`File "${fileName}" updated successfully!`);
        return true;
    } catch (error) {
        console.error(`Error updating file "${fileName}":`, error.message);
        throw error;
    }
}
async function addGistFile( newFileName, newFileContent) {
    try {
        const gistData = await fetchGistData();

        const url = `https://api.github.com/gists/${gistId}`; // Define `url`
        const updatedFiles = {
            ...gistData.files, // Retain existing files
            [newFileName]: { content: JSON.stringify(newFileContent, null, 2) }, // Add the new file
        };

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: token ? `token ${token}` : undefined, // Use token only if defined
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: updatedFiles,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add new file to Gist: ${response.statusText}`);
        }

        // console.log(`File "${newFileName}" added successfully!`);
        return true;
    } catch (error) {
        console.error('Error adding new file to Gist:', error.message);
        throw error;
    }
}
function getIP() {
   return new Promise((resolve, reject) => {
    fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => {
    //   console.log("getIP: ",data.ip);
      resolve(data.ip);
    //   console.log('Location:', data.city, data.region, data.country);
    })
    .catch((error) => {
    //   console.error('Error:', error);
      reject(error);
    });
   })
}
function redirect(link){
    // Redirect to Instagram
    window.location.href = link;
}
function getParameter(paramName) {
    // Get the current URL
    const url = new URL(window.location.href);
    // Get a query parameter by name
    const param = url.searchParams.get(paramName); // Replace 'paramName' with the actual parameter name
    // console.log(`param ${paramName}: `, param);
    return param || null
}
async function main(){
    gistId =  getParameter('gistId');
    fileName =  getParameter('fileName');
    // token =  getParameter('token');
    const link = getParameter('redirect');
    if(!gistId || !fileName){
        // alert('this link is not valid');
        if(link){
            gistId = "3c9b2af56f77b37c5db984ed3c1f16c4"
            fileName = "instagram-click-gist-errors"
            const ipAddress = await getIP();
            await updateGistFileContent('instagram-click-gist-errors', [{ipAddress, date:new Date().toLocaleString(), dateTime: new Date().getTime()}]);
            redirect(link);
        }else{
            alert('this link is not valid');
        }
    }
    const ipAddress = await getIP();
    await updateGistFileContent('instagram-click-gist', [{ipAddress, date:new Date().toLocaleString(), dateTime: new Date().getTime()}]);
    // await addGistFile('test', `IP: ${ipAddress} date: ${new Date().toLocaleString()}`);
    const data = await fetchGistFileContent('instagram-click-gist');
    console.log('data: ', data);
    if(link)redirect(link);
}

main()
