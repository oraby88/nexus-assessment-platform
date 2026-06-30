from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Message": "Welcome to the FastAPI application!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.get("/users/{user_name}")
def read_user(user_name: str):
    return {"user_name": user_name}

@app.post("/items/")
def create_item(name:str, price:float, quantity:int):
    return {"name": name, "price": price, "quantity": quantity}