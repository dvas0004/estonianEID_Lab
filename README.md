# estonianEID_Lab
playing around with google chrome plugins and Estonian eID


This repo serves as my testlab for uderstanding google chrome extensions, particularly the native messaging functionality. As such, you may find the code is a bit needlessly convoluted, since I attempted to use everything I could from the Chrome API. 

At this stage, the extension would only work on Linux for a few reasons.

For example, the project consists of all three types of Google Chrome Extenstion files:
  - Content Script
  - Popup Script
  - Background script

And of course the native messaging host. Some functionality that I placed in the popup script can be placed in the content script, and this is definitely not meant for production for a number of reasons.

I will put more details into a blog post, including more improvements to be done