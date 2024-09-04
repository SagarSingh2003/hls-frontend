import { useState, useEffect } from 'react';
import './UploadButton.css';

const UploadButton = () => {
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const [showUploadButton, setShowUploadButton] = useState(false);
    const [uploadUrl, setUploadUrl] = useState('');

    const handleLimitCheck = (e : any) => {
        const selectedFile = e.target.files[0];
        const maxFileSize = 10 * 1024 * 1024;

        if (selectedFile && selectedFile.size > maxFileSize) {
            setError('Maximum allowed size for file is 10MB');
            setFile(null);
            e.target.value = '';
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    useEffect(() => {

        if (file) {
            setShowUploadButton(true);

            const fetchPresignedUrl = async () => {
                try {
                    const response = await fetch(`http://ec2-13-201-222-49.ap-south-1.compute.amazonaws.com/get-s3-presigned-url/${file.name}`);
                    console.log("Response: ", response);
                    
                    const data = await response.json();
                    console.log("Data: ", data);
                    console.log("Upload Url: ", data.uploadURL);
                    
                    
                    setUploadUrl(data.uploadURL);

                } catch (err) {
                    setError('Failed to fetch presigned URL');
                }
            };
            fetchPresignedUrl();

        } else {
            setShowUploadButton(false);
        }

    }, [file]);

    const handleFileUpload = async () => {
        if (!uploadUrl) {
            setError('Upload URL not available');
            console.log("Error in handling file upload!");
            
            return;
        }
        else {
            try {
                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file
                });
                console.log("Success!!");
                
            } catch (err) {
                console.error('Error uploading file: ', err);
            }
        }  
    };

    return (
        <div className='upload-button'>
            <form className='form'>
                <label htmlFor="fileUpload" className='label'> Upload your file </label>
                <input 
                    type="file" 
                    id="fileUpload" 
                    accept="video/mp4"  
                    className='u-button'
                    onChange={handleLimitCheck}
                />
                {error && <div className='error'>{error}</div>}
            </form>
            {showUploadButton && (
                <button className='upload-file-button' onClick={handleFileUpload}>
                    Upload File
                </button>
            )}
        </div>
    );
};

export default UploadButton;
