<?php use Fisharebest\Webtrees\View; ?>

<div class="row">
  <?php if (empty($main_blocks) || empty($side_blocks)): ?>
	  <div class="col-md-12 wt-main-blocks py-3">
		<?php foreach ($main_blocks + $side_blocks as $block_id => $block): ?>
			<?= View::make('tree-page-block', ['block_id' => $block_id, 'block' => $block, 'tree' => $tree]) ?>
		<?php endforeach ?>
	  </div>
  <?php else: ?>
	  <div class="col-md-9 wt-main-blocks py-3">
		<?php foreach ($main_blocks as $block_id => $block): ?>
			<?= View::make('tree-page-block', ['block_id' => $block_id, 'block' => $block, 'tree' => $tree]) ?>
		<?php endforeach ?>
	  </div>
	  <div class="col-md-3 wt-side-blocks py-3">
		<?php foreach ($side_blocks as $block_id => $block): ?>
			<?= View::make('tree-page-block', ['block_id' => $block_id, 'block' => $block, 'tree' => $tree]) ?>
		<?php endforeach ?>
	  </div>
  <?php endif ?>
</div>
