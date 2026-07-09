const downloadBtn = document.getElementById('downloadBtn');
const percentageText = document.querySelector('.percentage-text');
const parachuteWrapper = document.querySelector('.parachute-wrapper');
const notification = document.getElementById('downloadNotification');


const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav');
successSound.volume = 0.5; 

downloadBtn.addEventListener('click', () => {
  if (downloadBtn.classList.contains('is-loading') || downloadBtn.classList.contains('is-success')) return;

  downloadBtn.classList.add('is-loading');
  
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += 2; 
    percentageText.innerText = `${progress}%`;
    
    let currentTop = -10 + (progress * 0.35); 
    parachuteWrapper.style.top = `${currentTop}px`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      
      downloadBtn.classList.remove('is-loading');
      downloadBtn.classList.add('is-success');
      
      
      setTimeout(() => {
        
        successSound.play().catch(err => console.log("Sound play delayed until user interacts."));
        
       
        notification.classList.add('show');
        
      
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3500);

      }, 400);
      
      
      triggerActualDownload('cv.pdf', 'ABD_CV.pdf');
    }
  }, 60); 
});

function triggerActualDownload(fileUrl, fileName) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}