@Override
public UserDetails loadUserByUsername(String identifier)
        throws UsernameNotFoundException {

    var userOptional = userRepository.findByEmail(identifier);
    if (userOptional.isEmpty()) {
        userOptional = userRepository.findByUsername(identifier);
    }

    User user = userOptional.orElseThrow(() ->
            new UsernameNotFoundException("User not found"));

    return new CustomUserDetails(user);
}