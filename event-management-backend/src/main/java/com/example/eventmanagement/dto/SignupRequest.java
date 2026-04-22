/**
 * SignUp Request - Minoka
 */
package com.example.eventmanagement.dto;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}
