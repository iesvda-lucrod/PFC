import { Icon_arrow_forward, Icon_arrow_forward_big, Icon_brand_big, Icon_brand, Icon_brand_small, Icon_Facebook, Icon_Instagram, Icon_LinkedIn, Icon_menu, Icon_phone, Icon_Twitter_X, Icon_user } from "../../../assets/icons";
import "./LandingPage.css";
import image_collaboration from "../../../assets/images/static/collaboration.jpeg";
import image_cooperation from "../../../assets/images/static/cooperation.jpeg";
import image_real_time from "../../../assets/images/static/real_time_collaboration.webp";
import image_team from "../../../assets/images/static/team.jpg";
import { Link } from "react-router-dom";
import AnimateEntry from "./components/AnimateEntry/AnimateEntry";
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {

    const anchorScroll = (e) => {
        e.preventDefault();

        const scrollTo = e.currentTarget.getAttribute('href').substring(1);
        document.getElementById(scrollTo).scrollIntoView({behavior: 'smooth'});
    }

    return (
        <div id='LandingPage' className="LandingPage">

            <Helmet>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <title>Syncro - Task Management & Collaboration Tool</title>
            <meta 
            name="description" 
            content="Organize group projects online with ease. Break work into sections and tasks, assign roles, track progress, and collaborate in real-time — all in one powerful project management tool." 
            />
            <meta name="keywords" content="group project management tool, organize group tasks, online task manager for teams, remote team collaboration software, project planning app, task tracking for groups" />
            </Helmet>

            <header id="header">

                <AnimateEntry>
                <div className="title">
                    <h1><Icon_brand_big/></h1>
                    <h2>Organize your dream project</h2>
                </div>
                </AnimateEntry>

                <AnimateEntry>
                <Link to={'/auth'} className="cta Link">Get Started! <Icon_arrow_forward_big/> </Link> 
                </AnimateEntry>
            </header>

            <main>
                
                <section id='bulletPoints' className="bulletPoints">
                <AnimateEntry>
                    <section className="point">
                        <div className="imagePart hideOnSmall">
                            <img src={image_collaboration} alt="" />
                        </div>
                        <div className="textPart">
                            <div className="textContainer">
                                <h2>Organize Group Projects Online — All in One Place</h2>
                                <p>Struggling to keep your team aligned? Our online collaboration tool makes group project management easy. Divide your work into structured sections and tasks, assign team roles, and keep everything organized from start to finish — all in one intuitive web platform.</p>
                            </div>
                        </div>
                    </section>
                </AnimateEntry>
                   
                    
                <AnimateEntry>
                    <section className="point">
                        <div className="imagePart hideOnSmall">
                            <img src={image_cooperation} alt="Several people's arms doing a group fistbump over a table with laptops and electronic devices on top" />
                        </div>
                        <div className="textPart">
                            <div className="textContainer">
                                <h2>Task Management Built for Teamwork</h2>
                                <p>Break big projects into smaller, manageable pieces. Our project task management features let you create sections, assign tasks to group members, and track progress — no more confusion or overlapping responsibilities.</p>
                            </div>
                        </div>
                    </section>
                    
                </AnimateEntry>
                    
                <AnimateEntry>
                    <section className="point">
                        <div className="imagePart hideOnSmall">
                            <img src={image_real_time} alt="A man poitning at a whiteboard with the employees listed on it" />
                        </div>
                        <div className="textPart">
                            <div className="textContainer">
                            <h2>Real-Time Collaboration Without the Hassle</h2>
                            <p>Stay connected and productive with built-in real-time updates. Everyone knows what to do, when to do it, and who’s doing what — making it the perfect tool for remote teams, student groups, and collaborative professionals.</p>
                            </div>
                        </div>
                    </section>
                </AnimateEntry>

                <AnimateEntry>
                    <section className="point">
                        <div className="imagePart hideOnSmall">
                            <img src={image_team} alt="" />
                        </div>
                        <div className="textPart">
                            <div className="textContainer">
                            <h2>Designed for Teams of Any Size</h2>
                            <p>Whether you're managing a school assignment, launching a startup, or planning an event, our platform scales with your needs. Customize sections and workflows to fit any group project, from two-person teams to large collaborations.</p>
                            </div>
                        </div>
                    </section>
                </AnimateEntry>
                </section>

                <section id='#informative' className="informative">
                <AnimateEntry>
                    
                    <div id='reasonsToUse'>
                        <h2>Why you should use Syncro</h2>
                        <ul>
                            <li>Simplify project planning with drag-and-drop task organization</li>
                            <li>Improve accountability with clear assignments and timelines</li>
                            <li>Access your project dashboard from any device</li>
                            <li>Built for productivity — no clutter, no distractions</li>
                            <li><b>Syncro is totally free!</b></li>
                        </ul>
                    <Link to={'/auth'} className="cta">Im conviced!<Icon_arrow_forward_big/></Link>
                    </div>

                    <div id='interested'>
                        <h2>Interested?</h2>
                        <p>If you have any questions or need more information, our friendly support team is here to help. Don’t hesitate to reach out—we’re just a click away!</p>
                        <Link to={'/contact'} className="cta"> Contact <Icon_arrow_forward_big/></Link>
                    </div>    

                </AnimateEntry>
                </section>

                       

            </main>

            <footer>
                <section className="anchors">
                    <h3>About</h3>
                    <div className="content">
                        <ul>
                            <li> <a href={'#header'} onClick={anchorScroll}>Back to top</a> </li> 
                            <li> <a href={'#bulletPoints'} onClick={anchorScroll}>What do we offer?</a> </li>
                            <li> <a href={'#informative'}>Why use Syncro</a> </li>
                        </ul>
                    </div>
                </section>

                <section className="sites">
                    <h3>Sites</h3>
                    <div className="content">
                        <ul>
                            <Link><li>Blog <Icon_menu/></li></Link>
                            <Link to={'/contact'}><li>Contact <Icon_phone/></li></Link>
                            <Link to={'/auth'}><li>Login <Icon_user/></li></Link>
                        </ul>
                    </div>
                </section>
                <section className="socials">
                    <h3>Social networks</h3>
                    <div className="content">
                        <ul>
                            <li> <a href='facebook'> <span className="hideOnSmall">Facebook</span>     <Icon_Facebook/>     </a> </li>
                            <li> <a href='facebook'> <span className="hideOnSmall">Instagram</span>    <Icon_Instagram/>    </a> </li>
                            <li> <a href='facebook'> <span className="hideOnSmall">X</span>            <Icon_Twitter_X/>    </a> </li>
                            <li> <a href='facebook'> <span className="hideOnSmall">LinkedIn</span>     <Icon_LinkedIn/>     </a> </li>
                        </ul>
                    </div>
                    
                </section>
            </footer>
        </div>
    );
    
}