var posts=["2025/10/24/BLOG1024/","2025/10/19/APCS202510/","2025/09/30/CPEmediumship/","2025/08/17/HITCON2025/","2025/09/22/touchgrass/","2025/08/27/DP/","2025/11/21/NFU/","2025/09/13/oooo/","2025/08/19/Tips/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };