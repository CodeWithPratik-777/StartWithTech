const LegalPage = require('../models/LegalPage');

exports.getLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    const page = await LegalPage.findOne({ type });

    if (!page) return res.status(404).json({ message: 'Page not found' });

    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    const { content } = req.body;

    const updated = await LegalPage.findOneAndUpdate(
      { type },
      { content, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json({ message: `${type} page updated`, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
