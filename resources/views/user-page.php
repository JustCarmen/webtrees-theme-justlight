<h2 class="text-center mb-0 pb-3">
	<?= $title ?>
</h2>

<div class="row">
	<?php if (empty($main_blocks) || empty($side_blocks)): ?>
		<div class="col-md-12 wt-main-blocks">
			<?php foreach ($main_blocks + $side_blocks as $block_id => $block): ?>
				<?= view('user-page-block', ['block_id' => $block_id, 'block' => $block, 'tree' => $tree]) ?>
			<?php endforeach ?>
		</div>
	<?php else: ?>
		<div class="col-md-9 py-3 wt-main-blocks">
			<?php foreach ($main_blocks as $block_id => $block): ?>
				<?= view('user-page-block', ['block_id' => $block_id, 'block' => $block, 'tree' => $tree]) ?>
			<?php endforeach ?>
		</div>
		<div class="col-md-3 py-3 wt-side-blocks">
			<?php foreach ($side_blocks as $block_id => $block): ?>
				<?= view('user-page-block', ['block_id' => $block_id, 'block' => $block, 'tree' => $tree]) ?>
			<?php endforeach ?>
		</div>
	<?php endif ?>
</div>
