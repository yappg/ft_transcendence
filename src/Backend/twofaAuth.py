# import pyotp
# import time 

# # secret_key = pyotp.random_base32()
# # totp = pyotp.TOTP(secret_key) #totp object
# # print(secret_key)

# # uri = totp.provisioning_uri(name='transcendence', issuer_name='kadigh')
# # print  (f' URI : {uri}')
# def generate_uri():
#     secret_key = pyotp.random_base32()
#     totp = pyotp.TOTP(secret_key)
#     uri = totp.provisioning_uri(name='transcendence', issuer_name='kadigh') # issuer_name=username
#     #URI must be converted to QR Code then send it to front
#     return uri
# print( generate_uri())

# # name='test', issuer_name='test'
# # totp = pyotp.TOTP('base32secret3232')
# # print(type(totp))
# # otp1 = totp.now()
# # print(otp1)
# # time.sleep(19)
# # otp2 = totp.now()
# # print(otp2)
# # print(totp.verify(otp2) )# => True/False

import qrcode
from PIL import Image

# Text to encode into a QR code
text = "otpauth://totp/kadigh:transcendence?secret=M7DVOZ4YTBPMQA76DFNENF2TE472EYXT&issuer=kadigh"

# Generate QR code
qr = qrcode.QRCode(
    version=2,  # Controls the size of the QR Code
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # Error correction level
    box_size=10,  # Size of each box in the QR code
    border=4,  # Thickness of the border
)
qr.add_data(text)
qr.make(fit=True)

# Create an image from the QR code
img = qr.make_image(fill='black', back_color='white')

# Show the image
img.show()