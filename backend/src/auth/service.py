SECRET_KEY = "your_secret_key_here"  # Replace with your actual secret key
ALGORITHM = "HS256"

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")
bycrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

