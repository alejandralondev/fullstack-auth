// // everything that's static is in public 

// const trash = document.getElementsByClassName("fa-trash-o")

// Array.from(trash).forEach(function (element) {
//     element.addEventListener('click', function () {
//         var jobElement = this.parentNode 
//         // check if job element was found
//         if (jobElement && jobElement.classList.contains('job')) {
//             fetch(`/jobs`, {
//                 method: 'delete',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     'id': id,
//                 })
//             }).then(function (response) {
//                 window.location.reload() 
//             }) 
//         }
//     }) 
// }) 

const trash = document.getElementsByClassName("fa-trash-o");

Array.from(trash).forEach(function (element) {
    element.addEventListener('click', function () {
        const jobElement = this.closest('.job');
        console.log(jobElement)
        const jobId = this.dataset.id
        console.log(jobId)
         
            fetch(`jobs`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                  'id': jobId
                })
            }).then(data => {
                console.log('Job deleted:', data);
                window.location.reload(); 
            })
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//   const trash = document.querySelectorAll('.fa-trash-o');

//   trash.forEach(function (icon) {
//       icon.addEventListener('click', function () {
//           const jobElement = this.parentNode;
//           if (jobElement.classList.contains('job')) {
//               const jobId = jobElement.getAttribute('data-jobid');

//               fetch(`/jobs/${jobId}`, {
//                   method: 'DELETE',
//                   headers: {
//                       'Content-Type': 'application/json'
//                   }
//               })
//               .then(response => {
//                   if (response.ok) {
//                       return response.json();
//                   }
//                   throw new Error('Failed to delete job');
//               })
//               .then(data => {
//                   console.log('Job deleted:', data);
//                   window.location.reload(); // Reload the page after successful deletion
//               })
//               .catch(error => {
//                   console.error('Error:', error);
//               });
//           }
//       });
//   });
// });
