<script>
  async function verifyFork() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const resultDiv = document.getElementById('result');
    const herokuLinkContainer = document.getElementById('herokuLinkContainer');

    resultDiv.textContent = 'Checking...';
    herokuLinkContainer.style.display = 'none';

    if (!username) {
      resultDiv.textContent = 'Please enter your GitHub username.';
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);

      if (!response.ok) {
        if (response.status === 404) {
          resultDiv.textContent = `User "${username}" not found on GitHub.`;
        } else {
          resultDiv.textContent = `GitHub API Error: ${response.status} - ${response.statusText}`;
        }
        return;
      }

      const repos = await response.json();

      // More rigorous check: Look for a repo that is a fork AND whose parent is the exact POPKID-XTECH repo
      const found = repos.some(repo => {
        if (repo.fork && repo.parent) {
          const parentFullNameLower = repo.parent.full_name.toLowerCase();
          const expectedParentFullName = 'popkiddevs/popkid-xtech';
          return parentFullNameLower === expectedParentFullName && repo.owner.login.toLowerCase() === username.toLowerCase();
        }
        return false;
      });

      if (found) {
        resultDiv.textContent = 'Fork verified!';
        herokuLinkContainer.style.display = 'block';
      } else {
        resultDiv.textContent = `No valid fork of ${'POPKID-XTECH'} found under the username "${username}". Please ensure you have forked the repository directly from ${'https://github.com/Popkiddevs/POPKID-XTECH'} and that it belongs to your account.`;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      resultDiv.textContent = `An unexpected error occurred: ${error.message}`;
    } finally {
      usernameInput.value = ''; // Clear the input field after checking
    }
  }

  function playSong() {
    const player = document.getElementById('songPlayer');
    player.play();
  }
</script>
