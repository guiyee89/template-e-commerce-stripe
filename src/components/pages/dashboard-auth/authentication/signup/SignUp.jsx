//SIGNUP CREADO POR MI
// import { TextField } from "@mui/material";
// import { FcGoogle } from "react-icons/fc";
// import styled from "styled-components/macro";

// export const SignUp = ( {handleSubmit, handleChange, errors, handleSubmitGoogle} ) => {

//   return (
//     <Wrapper>
      
//         <Form onSubmit={handleSubmit}>
          
//             <Input 
//               label="Email"
//               variant="outlined"
//               name="email"
//               onChange={handleChange}
//               helperText={errors.email}
//               error={errors.email ? true : false}
//             />
         
//           <Input 
//               label="Password"
//               variant="outlined"
//               name="password"
//               onChange={handleChange}
//               helperText={errors.password}
//               error={errors.password ? true : false}
//             />
//             <Input 
//               label="Repeat Password"
//               variant="outlined"
//               name="password"
//               onChange={handleChange}
//               helperText={errors.password}
//               error={errors.password ? true : false}
//             />
//           <button type="submit">Sign up</button>
//         </Form>
//         <GoogleWrapper>
//          <Google />
//         <BtnGoogle onClick={handleSubmitGoogle}>Sign up with Google</BtnGoogle>
//       </GoogleWrapper>
//     </Wrapper>
//   );
// };
// const Wrapper = styled.div``;
// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   gap: 1rem;
// `;
// const Input = styled(TextField)`
//   width: 280px;
// `;
// const GoogleWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: end;
//   margin-top: 16px;
//   width: 100%;
// `;
// const BtnGoogle = styled.button`
// margin-left: 16px;
// `;
// const Google = styled(FcGoogle)`
//   margin-left: -47px;
//   font-size: 1.6rem;
// `;
