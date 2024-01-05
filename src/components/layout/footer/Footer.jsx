import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import styled from "styled-components/macro";

export const Footer = () => {
  return(
    <>
      <Section>
       <FooterWrapper>
         <FooterContent>
           <FooterTitle>WeShop</FooterTitle>
           <FooterText>
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni sit sint fuga! Sit, animi.
           </FooterText>
           <SocialsWrapper>
             <SocialsItem>
               <SocialsLink href="https://www.facebook.com/" target="_blank">
                  <FacebookIcon fontSize="large" />
               </SocialsLink>
             </SocialsItem>
             <SocialsItem>
               <SocialsLink href="https://www.youtube.com/" target="_blank">
                  <YouTubeIcon fontSize="large"/>
               </SocialsLink>
             </SocialsItem>
             <SocialsItem>
               <SocialsLink href="https://twitter.com/home" target="_blank">
                 <TwitterIcon fontSize="large"/>
               </SocialsLink>
             </SocialsItem>
             <SocialsItem>
               <SocialsLink href="https://www.instagram.com/" target="_blank">
                 <InstagramIcon fontSize="large"/>
               </SocialsLink>
             </SocialsItem>
           </SocialsWrapper>
         </FooterContent>
         <FooterBottom>
           <FooterTextBottom>
             copyright &copy;2023 WeShop e-commerce. Designed by <FooterTextSpan>GMD</FooterTextSpan>
           </FooterTextBottom>
         </FooterBottom>
       </FooterWrapper>
     </Section>
    </>
  )
}

const Section = styled.section`
  background-color: rgb(243, 239, 239);
`;

const FooterWrapper = styled.footer`
  height: auto;
  font-family: open sans-serif;
  padding-top: 40px;
  color: black;
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const FooterTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 400;
  text-transform: capitalize;
`;

const FooterText = styled.p`
  max-width: 500px;
  margin: 10px auto;
  line-height: 28px;
  font-size: 14px;
`;

const SocialsWrapper = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  margin: 1rem 0 3rem 0;
`;

const SocialsItem = styled.li`
  margin: 0 10px;
  width: 50px;
`;

const SocialsLink = styled.a`
  text-decoration: none;
  color: black;
  transition: color 0.5s ease;
  &:hover i {
    color: violet;
  }
`;

const FooterBottom = styled.div`
  background-color: rgb(243, 239, 239);
  padding: 20px 0;
  text-align: center;
`;

const FooterTextBottom = styled.p`
  font-size: 14px;
  word-spacing: 2px;
  text-transform: capitalize;
`;

const FooterTextSpan = styled.span`
  text-transform: uppercase;
  opacity: 0.4;
  font-weight: 200;
`;
