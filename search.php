<!DOCTYPE html>
<html lang="en">
<head>
    <title>Search results</title>
    <meta charset="utf-8">
    <meta name = "format-detection" content = "telephone=no" />
    <link rel="icon" href="img/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
    <meta name="description" content="Your description">
    <meta name="keywords" content="Your keywords">
    <meta name="author" content="Your name">   
    <meta name = "format-detection" content = "telephone=no" /> 
    <link rel="stylesheet" href="css/bootstrap.css" type="text/css" media="screen">
    <link rel="stylesheet" href="css/responsive.css" type="text/css" media="screen">
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="search/search.js"></script>
    <script type="text/javascript" src="js/superfish.js"></script>
    <script type="text/javascript" src="js/jquery.mobilemenu.js"></script>
    <!--[if lt IE 8]>
        <div style='text-align:center'><a href="http://www.microsoft.com/windows/internet-explorer/default.aspx?ocid=ie6_countdown_bannercode"><img src="http://www.theie6countdown.com/img/upgrade.jpg"border="0"alt=""/></a></div>  
    <![endif]-->
    <!--[if lt IE 9]>
      <link rel="stylesheet" href="css/ie.css" type="text/css" media="screen">
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>

<body>
<!--==============================header=================================-->
<header>
    <div class="container">
         <div class="navbar navbar_ clearfix">
            <div class="navbar-inner">      
                  <div class="clearfix">
                    <h1 class="brand"><a href="index.html"><img src="img/logo.png" alt=""></a><span>Games The biggest choice on the web</span></h1>
                    <div class="div-search">
                      <form id="search" action="search.php" method="GET" accept-charset="utf-8">
                        <input type="text" value="" name="s">
                        <a href="#" onClick="document.getElementById('search').submit()">Search</a>
                      </form>
                    </div>
                  </div>
                  <div class="nav-collapse nav-collapse_ collapse">
                      <ul class="nav sf-menu clearfix">
                        <li><a href="index.html">Home</a></li>
                        <li class="sub-menu"><a href="index-1.html">Games</a>
                           <ul>
                            <li><a href="#">Lorem ipsum dolor </a></li>
                            <li><a href="#">Sit amet conse </a></li>
                            <li><a href="#">Ctetur adipisicing elit</a></li>
                            <li><a href="#">Sed do eiusmod </a></li>
                            <li><a href="#">Tempor incididunt ut </a></li>
                            <li><a href="#">Labore et </a></li>
                           </ul>
                        </li>
                        <li><a href="index-2.html">Reviews</a></li>
                        <li><a href="index-3.html">News</a></li>
                        <li><a href="index-4.html">Contacts</a></li>
                      </ul>
                  </div>
                  
             </div>  
         </div>
    </div>
</header>
<section id="content">
  <div class="container">
    <div class="row">
      <div class="span12">
       <h2 class="h2-pad">Search result:</h2>
        <div id="search-results"></div>
      </div>
    </div>
  </div>
</section>
<footer>
  <div class="container">
       <div class="row">
           
           <article class="span6 fright">
             <ul class="soc-icons">
               <li><a href="#" id="icon"></a></li>
               <li><a href="#" id="icon-1"></a></li>
               <li><a href="#" id="icon-2"></a></li>
               <li><a href="#" id="icon-3"></a></li>
             </ul>
           </article>
           <article class="span6  fleft">
                 <span><a href="index.html">Games</a> &copy; 2013&nbsp;&nbsp;&nbsp;&nbsp;</span><a href="index-5.html">Privacy Policy</a>
                 
           </article>
       </div>
  </div>
</footer>
<script type="text/javascript" src="js/bootstrap.js"></script>
</body>
</html>