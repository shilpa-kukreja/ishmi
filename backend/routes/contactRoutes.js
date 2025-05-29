import express from 'express'
import { addContact, listContact, removeContact } from '../controllers/contactController.js';



const contactRouter=express.Router();
contactRouter.post('/add',addContact);
contactRouter.get('/get',listContact);
contactRouter.post('/remove',removeContact);

export default contactRouter;