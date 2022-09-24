# VEX Scouting
<b>Author:</b> Rishi Bala  
<b>Email:</b> rishibala2007@gmail.com  
<b>Repository:</b> https://github.com/rbala25/VEX-Scouting  
<br>
<b>Languages:</b> JavaScript, HTML5, CSS3  
        <b>Technology:</b> Express.js, Node.js, EJS, MongoDB, Mongoose, AWS EC2  
           <b>Other Dependencies:</b> Axios, Cookie-Parser, Node-Cron, Express-Sesssion  
           <b>Robot Events API:</b> <a href="https://www.robotevents.com/api/v2">API v2</a>
          
<br>
        <h3>Inspiration</h3>
        <p>I have competed in some form of VEX Robotics since 2015, over 7 years as of right now. In my last 2 years of
            VRC,
            I have come to realize that winning tournaments takes more than building a good robot. While that is
            certainly
            important, picking alliance partners and broadcasting your team's name out there is as imporant, if not
            more.
        </p>
        <p>Scouting teams takes tons of effort. Even with dedicated team members at competitions, you can't hope to meet
            every single team. It's an extremely tedious process, using your 5 minutes of downtime between matches to
            look
            for a team, realize they aren't even there, and then have to scramble back to the field for your next match.
            Even when you do find the team, oftentimes the chances that they are someone you'd consider to pick is
            extremely
            low. With
            this website, we are able to record every team we meet with efficiently, as well as
            having the knowledge of which teams are more experienced and skillful than others.</p>
            
<br>
<h3>How it Works</h3>

<b><u>The Algorithm and Data Requests</u></b>
        <p>Every 12 hours, the website requests data from the public <a class="classchoose"
                href="https://www.robotevents.com/">RobotEvents</a>
            API. The website takes all the information it can find about every single registered team, storing it on a
            database, and then using a series of mathamatical operations to calculate a teams <b>True Skill.</b></p>
        <p><u>Every team starts with a True Skill of 0.</u> As the website sifts through each and every single
            registered
            robot, it adds points depending on the teams <b>proven success</b>. It takes in factors such as if the team
            made
            VEX World's
            last
            year, and it adds a certain amount of points for every single award the team has earned over the last two
            seasons. Furthermore, while RobotEvents does not directly release much team information to the public, the
            website still goes through every team and manages to calculate dozens of different factors, such as World
            Skills
            Standings. This leads to an accurate depiction of any teams skill level. </p>
<br>
<b><u>The Alliance Selector</u></b>
        <p>The Alliance Selector is largely based off of our TrueSkill rankings. When a user requests team rankings for
            any
            given event, the website sorts through all participating teams in that event and lists them based off of
            their
            calculated True Skill. If the user selects certain filter valuations that they want in a robot, the website
            will
            again go through all partcipating teams and temporarily add more points to their True Skill ranking if they
            apply to this category. Once again, this leads to an accurate ranking for all participating teams.</p>

