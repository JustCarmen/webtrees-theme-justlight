<?php use Fisharebest\Webtrees\Html; ?>

<div class="d-flex flex-wrap flex-lg-nowrap justify-content-around">
	<?php foreach ($links as $link): ?>
		<div class="col-lg-4 text-center p-1">
			<a href="<?= Html::escape($link['url']) ?>">
				<i class="<?= $link['icon'] ?> w-100"></i>
				<?= $link['title'] ?>
			</a>
		</div>
	<?php endforeach ?>
</div>
