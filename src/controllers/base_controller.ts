// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async post(req: Request, res: Response) {
    try {
      const obj = new this.model(req.body);
      const savedObj = await obj.save();
      res.status(201).json(savedObj);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const filter = req.query.sender ? { owner: req.query.sender } : {};
      const objs = await this.model.find(filter);
      res.status(200).json(objs);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const obj = await this.model.findById(req.params.id);
      if (obj) res.status(200).json(obj);
      else res.status(404).json({ message: "Not found" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async put(req: Request, res: Response) {
    try {
      const obj = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(obj);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Deleted" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}

const createController = <T>(model: Model<T>) => new BaseController<T>(model);
export default createController;