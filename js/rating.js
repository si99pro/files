 // Assuming Firebase is initialized as shown above.

      function getPostId() {
        const postElement = document.querySelector('article.ntry.ps.post'); // More specific selector

        if (postElement) {
          const postId = postElement.getAttribute('data-id');
          if (postId) {
            return postId;
          }
        }

        console.error("Could not find post ID in the template. Check the getPostId() function.");
        return "default_post_id";
      }

      const postId = getPostId();
      console.log("Post ID:", postId); // Debugging

      const stars = document.querySelectorAll('.star');
      const averageRatingDisplay = document.getElementById('average-rating');
      const ratingCountDisplay = document.getElementById('rating-count');
      const voteMessage = document.getElementById('vote-message');


      let currentRating = 0; // Store the current rating
      let hasVoted = localStorage.getItem(`voted_${postId}`);  // Load initial voted state


        // Function to handle star hover effect
      function handleStarHover(rating) {
            if(hasVoted) return; // No hover effect after voting

            stars.forEach((star, index) => {
                const icon = star.querySelector('i');
                if (index < rating) {
                  star.classList.add('filled');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                } else {
                  star.classList.remove('filled');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            });
        }

        // Function to reset star display
        function resetStarDisplay() {
            if(hasVoted) return; // No reset if already voted

             // Fill the stars based on the current rating
            fillStars(currentRating);
        }


        function disableStars() {
            stars.forEach(star => {
               star.classList.add('disabled');
            });
        }

        // Attach hover event listeners
        stars.forEach(star => {
            star.addEventListener('mouseover', function () {
                const rating = parseInt(this.getAttribute('data-rating'));
                handleStarHover(rating);
            });

            star.addEventListener('mouseout', resetStarDisplay); // Reset when mouse leaves
        });

      stars.forEach(star => {
        star.addEventListener('click', function() {
          if(hasVoted) return;  //Prevent voting after first vote.
          const rating = parseInt(this.getAttribute('data-rating'));
          submitRating(postId, rating);
        });
      });

       async function submitRating(postId, rating) {
            if (!db) {
                console.error("Firebase Realtime Database not initialized. Check initialization script.");
                return;
            }


            try {

                // User hasn't voted yet, proceed to update the rating
                const postRef = firebase.database().ref('ratings/' + postId);
                const updates = {};

                updates['/sum'] = firebase.database.ServerValue.increment(rating);
                updates['/count'] = firebase.database.ServerValue.increment(1);

                await postRef.update(updates);

                // Set localStorage to indicate that the user has voted
                localStorage.setItem(`voted_${postId}`, 'true');
                hasVoted = true;  // Update local variable.
                disableStars(); // Disable stars after voting
                voteMessage.textContent = "Thanks for rating!";


                console.log('Rating submitted!');
                // Immediately fill the stars based on the rating just submitted
                fillStars(rating);
                currentRating = rating;  // Update currentRating immediately
                updateRatingDisplay(postId); // Refresh display after submitting

            } catch (error) {
                console.error('Error submitting rating:', error);
            }
        }

      async function updateRatingDisplay(postId) {
        if (!db) {
          console.error("Firebase Realtime Database not initialized.  Check initialization script.");
          return;
        }

        try {
          const postRef = firebase.database().ref('ratings/' + postId);
          postRef.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const sum = data.sum || 0;
              const count = data.count || 0;
              const average = count > 0 ? sum / count : 0;
              averageRatingDisplay.textContent = average.toFixed(2); // Format to 2 decimal places
              ratingCountDisplay.textContent = count;
               currentRating = Math.round(average);
              // Fill the stars based on the current rating
             fillStars(currentRating);
            } else {
              averageRatingDisplay.textContent = '0';
              ratingCountDisplay.textContent = '0';
              currentRating = 0;
              fillStars(currentRating);
            }


          });





        } catch (error) {
          console.error('Error getting average rating:', error);
        }
      }

      function fillStars(rating) {
            stars.forEach((star, index) => {
                const icon = star.querySelector('i');
                if (index < rating) {
                    star.classList.add('filled');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                } else {
                    star.classList.remove('filled');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            });
        }

      // Call updateRatingDisplay on page load to show the initial rating
      if (postId !== "default_post_id") { // Only call if postId is valid (i.e., getPostId is correctly implemented)
          updateRatingDisplay(postId);
      } else {
          console.warn("updateRatingDisplay not called because postId is the default value.  Ensure getPostId() is correctly implemented.");
      }

      //Initial setup on page load
      if(hasVoted) {
          disableStars();
          voteMessage.textContent = "Thanks for rating!";
      }
